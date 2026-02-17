#!/usr/bin/env python3
from __future__ import annotations

import argparse
import csv
import json
import re
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

MAX_ITEM_COLUMNS = 26
INCLUDED_TRANSACTION_TYPES = {"event-ticket", "packaged-event", "event-payment", "deposit"}


@dataclass
class OrderContact:
    name: str
    email: str
    created_utc: str


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Generate normalized ticket dashboard JSON data from CSV exports.")
    parser.add_argument(
        "--orders",
        type=Path,
        default=Path("/Users/lukeireland/Desktop/creventa.ticketed_event_orders.csv"),
        help="Path to creventa.ticketed_event_orders.csv",
    )
    parser.add_argument(
        "--transactions",
        type=Path,
        default=Path("/Users/lukeireland/Desktop/creventa.event_transactions.csv"),
        help="Path to creventa.event_transactions.csv",
    )
    parser.add_argument(
        "--venues",
        type=Path,
        default=Path("/Users/lukeireland/Desktop/Venue_Feedback.csv"),
        help="Path to Venue_Feedback.csv",
    )
    parser.add_argument(
        "--output",
        type=Path,
        default=Path("client/src/assets/ticket-dashboard/ticket-dashboard-data.json"),
        help="Output JSON path",
    )
    return parser.parse_args()


def parse_float(raw: str | None) -> float:
    if raw is None:
        return 0.0
    text = raw.strip()
    if not text:
        return 0.0
    try:
        return float(text)
    except ValueError:
        return 0.0


def parse_int_if_whole(value: float) -> int | float:
    rounded = round(value)
    if abs(value - rounded) < 1e-9:
        return int(rounded)
    return round(value, 2)


def clean_id(raw: str | None) -> str:
    value = (raw or "").strip()
    if not value:
        return ""
    if value == "000000000000000000000000":
        return ""
    return value


def normalize_status(raw: str | None) -> str:
    value = (raw or "").strip().lower()
    return value if value else "unknown"


def normalize_transaction_type(raw: str | None) -> str:
    value = (raw or "").strip().lower()
    return value if value else "unknown"


def choose_latest_contact(existing: OrderContact | None, candidate: OrderContact) -> OrderContact:
    if existing is None:
        return candidate
    if candidate.created_utc > existing.created_utc:
        return candidate
    return existing


def load_venue_map(path: Path) -> dict[str, dict[str, str]]:
    with path.open(newline="", encoding="utf-8") as handle:
        reader = csv.DictReader(handle)
        venues: dict[str, dict[str, str]] = {}
        for row in reader:
            venue_id = clean_id(row.get("_id"))
            if not venue_id:
                continue
            venues[venue_id] = {
                "id": venue_id,
                "name": (row.get("name") or "").strip() or venue_id,
                "currency": (row.get("currency") or "GBP").strip().upper() or "GBP",
                "currencySymbol": (row.get("currency_symbol") or "").strip(),
                "timezone": (row.get("timezone") or "Europe/London").strip() or "Europe/London",
            }
    return venues


def load_order_contacts(path: Path, venue_ids: set[str]) -> dict[tuple[str, str], OrderContact]:
    contacts: dict[tuple[str, str], OrderContact] = {}
    with path.open(newline="", encoding="utf-8") as handle:
        reader = csv.DictReader(handle)
        for row in reader:
            venue_id = clean_id(row.get("venue_id"))
            if venue_id not in venue_ids:
                continue

            joiner_id = clean_id(row.get("joiner_id"))
            if not joiner_id:
                continue

            name = (row.get("name") or "").strip()
            email = (row.get("email") or "").strip().lower()
            created_utc = (row.get("created") or "").strip()

            key = (venue_id, joiner_id)
            contacts[key] = choose_latest_contact(
                contacts.get(key),
                OrderContact(name=name, email=email, created_utc=created_utc),
            )
    return contacts


def derive_item_name(row: dict[str, str]) -> str:
    for index in range(MAX_ITEM_COLUMNS):
        value = (row.get(f"items[{index}].itemName") or "").strip()
        if value:
            return value
    return ""


def derive_total_tickets(row: dict[str, str]) -> int | float:
    quantity_total = 0.0
    for index in range(MAX_ITEM_COLUMNS):
        quantity_total += parse_float(row.get(f"items[{index}].quantity"))
    if quantity_total <= 0:
        return 1
    return parse_int_if_whole(quantity_total)


def derive_unit_price(row: dict[str, str], total_amount: float, total_tickets: int | float) -> float:
    for index in range(MAX_ITEM_COLUMNS):
        item_price = parse_float(row.get(f"items[{index}].itemPrice"))
        if item_price > 0:
            return round(item_price, 2)
    ticket_count = float(total_tickets)
    if ticket_count <= 0:
        return 0.0
    return round(total_amount / ticket_count, 2)


def derive_event_name(item_name: str, event_short_id: str, event_id: str, transaction_id: str) -> str:
    cleaned_item_name = item_name.strip()
    if cleaned_item_name:
        return cleaned_item_name
    if event_short_id:
        return f"Ticketed Event {event_short_id}"
    if event_id:
        return f"Event {event_id[-8:]}"
    return f"Ticket Transaction {transaction_id[-8:]}" if transaction_id else "Ticket Transaction"


def derive_event_key(event_id: str, event_short_id: str, event_name: str, transaction_id: str, record_id: str) -> str:
    if event_id:
        return f"event:{event_id}"
    if event_short_id:
        return f"short:{event_short_id}"

    normalized_name = re.sub(r"[^a-z0-9]+", "-", event_name.lower()).strip("-")
    if normalized_name:
        return f"name:{normalized_name}"
    if transaction_id:
        return f"tx:{transaction_id}"
    return f"row:{record_id}"


def fallback_name_from_email(email: str) -> str:
    if "@" not in email:
        return ""
    username = email.split("@", 1)[0]
    normalized = re.sub(r"[^a-zA-Z0-9]+", " ", username).strip()
    if not normalized:
        return ""
    return normalized.title()


def derive_guest_details(
    venue_id: str,
    joiner_id: str,
    event_guest_id: str,
    contacts: dict[tuple[str, str], OrderContact],
    transaction_id: str,
) -> tuple[str, str, str]:
    contact = contacts.get((venue_id, joiner_id)) if joiner_id else None
    email = (contact.email if contact else "").strip().lower()
    name = (contact.name if contact else "").strip()

    if not name and email:
        name = fallback_name_from_email(email)
    if not name and event_guest_id:
        name = f"Guest {event_guest_id[-6:]}"
    if not name and joiner_id:
        name = f"Guest {joiner_id[-6:]}"
    if not name:
        name = f"Guest {transaction_id[-6:]}" if transaction_id else "Guest"

    guest_key = (
        event_guest_id
        or joiner_id
        or email
        or transaction_id
        or re.sub(r"[^a-z0-9]+", "-", name.lower()).strip("-")
        or "guest"
    )
    return guest_key, name, email


def derive_paid_and_due(status: str, total_amount: float, remaining_balance: float, deposit_paid: float) -> tuple[float, float]:
    normalized_status = normalize_status(status)

    if normalized_status == "paid":
        return round(total_amount, 2), 0.0

    if normalized_status == "depositpaid":
        if remaining_balance > 0:
            paid = max(total_amount - remaining_balance, deposit_paid, 0.0)
            due = max(total_amount - paid, 0.0)
            return round(paid, 2), round(due, 2)
        if deposit_paid > 0 and deposit_paid < total_amount:
            return round(deposit_paid, 2), round(max(total_amount - deposit_paid, 0.0), 2)
        return round(total_amount, 2), 0.0

    paid_generic = max(total_amount - remaining_balance, 0.0)
    due_generic = max(total_amount - paid_generic, 0.0)
    return round(paid_generic, 2), round(due_generic, 2)


def generate_dataset(
    orders_path: Path,
    transactions_path: Path,
    venues_path: Path,
) -> dict[str, Any]:
    venues = load_venue_map(venues_path)
    venue_ids = set(venues.keys())
    contacts = load_order_contacts(orders_path, venue_ids)

    records: list[dict[str, Any]] = []

    with transactions_path.open(newline="", encoding="utf-8") as handle:
        reader = csv.DictReader(handle)
        for row in reader:
            venue_id = clean_id(row.get("venue_id"))
            if venue_id not in venue_ids:
                continue

            transaction_type = normalize_transaction_type(row.get("transactionType"))
            if transaction_type not in INCLUDED_TRANSACTION_TYPES:
                continue

            record_id = clean_id(row.get("_id"))
            transaction_id = (row.get("transactionId") or "").strip() or record_id

            total_amount = parse_float(row.get("totalAmount"))
            remaining_balance = parse_float(row.get("totalRemainingBalance"))
            deposit_paid = parse_float(row.get("totalDepositPaid"))
            paid_to_date, amount_due = derive_paid_and_due(
                normalize_status(row.get("status")),
                total_amount,
                remaining_balance,
                deposit_paid,
            )

            event_id = clean_id(row.get("event_id"))
            event_short_id = clean_id(row.get("ticketedEventShortId"))
            event_item_name = derive_item_name(row)
            event_name = derive_event_name(event_item_name, event_short_id, event_id, transaction_id)
            event_key = derive_event_key(event_id, event_short_id, event_name, transaction_id, record_id)

            joiner_id = clean_id(row.get("joiner_id"))
            event_guest_id = clean_id(row.get("event_guest_id"))
            guest_key, guest_name, guest_email = derive_guest_details(
                venue_id=venue_id,
                joiner_id=joiner_id,
                event_guest_id=event_guest_id,
                contacts=contacts,
                transaction_id=transaction_id,
            )

            total_tickets = derive_total_tickets(row)
            unit_price = derive_unit_price(row, total_amount, total_tickets)
            created_utc = (row.get("created") or "").strip()
            due_date_utc = (row.get("dueDate") or "").strip()

            records.append(
                {
                    "id": record_id,
                    "transactionId": transaction_id,
                    "transactionType": transaction_type,
                    "venueId": venue_id,
                    "eventKey": event_key,
                    "eventId": event_id or None,
                    "eventShortId": event_short_id or None,
                    "eventName": event_name,
                    "guestKey": guest_key,
                    "eventGuestId": event_guest_id or None,
                    "joinerId": joiner_id or None,
                    "guestName": guest_name,
                    "guestEmail": guest_email or None,
                    "createdUtc": created_utc or None,
                    "dueDateUtc": due_date_utc or None,
                    "status": normalize_status(row.get("status")),
                    "currency": ((row.get("currency") or "").strip().upper() or venues[venue_id]["currency"]),
                    "totalTickets": total_tickets,
                    "unitPrice": unit_price,
                    "totalAmount": round(total_amount, 2),
                    "paidToDate": paid_to_date,
                    "amountDue": amount_due,
                }
            )

    records.sort(key=lambda entry: entry.get("createdUtc") or "", reverse=True)
    venue_list = sorted(venues.values(), key=lambda entry: entry["name"].lower())

    return {
        "generatedAtUtc": datetime.now(timezone.utc).isoformat(),
        "sources": {
            "orders": str(orders_path),
            "transactions": str(transactions_path),
            "venues": str(venues_path),
        },
        "venueCount": len(venue_list),
        "transactionCount": len(records),
        "venues": venue_list,
        "records": records,
    }


def main() -> None:
    args = parse_args()
    dataset = generate_dataset(args.orders, args.transactions, args.venues)
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(dataset, separators=(",", ":")), encoding="utf-8")

    print(f"Generated {dataset['transactionCount']} records for {dataset['venueCount']} venues.")
    print(f"Output: {args.output}")


if __name__ == "__main__":
    main()

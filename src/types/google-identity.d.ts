interface GoogleIdCredentialResponse {
  credential: string;
  select_by?: string;
  clientId?: string;
}

interface GoogleIdInitializeOptions {
  client_id: string;
  callback: (response: GoogleIdCredentialResponse) => void;
  auto_select?: boolean;
  cancel_on_tap_outside?: boolean;
  context?: 'signin' | 'signup' | 'use';
  ux_mode?: 'popup' | 'redirect';
}

interface GoogleIdButtonConfiguration {
  type?: 'standard' | 'icon';
  theme?: 'outline' | 'filled_blue' | 'filled_black';
  size?: 'large' | 'medium' | 'small';
  text?: 'signin_with' | 'signup_with' | 'continue_with' | 'signin';
  shape?: 'rectangular' | 'pill' | 'circle' | 'square';
  width?: number;
}

interface GoogleIdentityAccounts {
  id: {
    initialize(options: GoogleIdInitializeOptions): void;
    renderButton(parent: HTMLElement, options: GoogleIdButtonConfiguration): void;
    cancel?(): void;
  };
}

interface Window {
  google?: {
    accounts?: GoogleIdentityAccounts;
  };
}

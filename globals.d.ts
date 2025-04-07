export {};

declare global {
  interface Window {
    TelegramLoginWidget: {
      dataOnauth: (user: any) => void;
    };
  }
}

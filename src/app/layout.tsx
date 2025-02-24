import {NextIntlClientProvider} from 'next-intl';
import {getLocale, getMessages} from 'next-intl/server';
import './globals.css';
import { CheckpointsProvider } from '../utils/context/cpContext';
import { EventProvider } from '../utils/context/eventContext';

export default async function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const messages = await getMessages();
  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider messages={messages}>
          <EventProvider>
          <CheckpointsProvider>{children}</CheckpointsProvider>
          </EventProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
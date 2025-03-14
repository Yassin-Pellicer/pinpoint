import {NextIntlClientProvider} from 'next-intl';
import {getLocale, getMessages} from 'next-intl/server';
import './globals.css';
import { CheckpointsProvider } from '../utils/context/cpContext';
import { EventProvider } from '../utils/context/eventContext';
import { MapProvider } from '../utils/context/mapContext';
import { SessionProvider } from '../utils/context/sessionContext';

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
            <CheckpointsProvider>
              <SessionProvider>
                <MapProvider>{children}</MapProvider>
              </SessionProvider>
            </CheckpointsProvider>
          </EventProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
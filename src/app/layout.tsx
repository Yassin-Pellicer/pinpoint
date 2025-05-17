import {NextIntlClientProvider} from 'next-intl';
import {getLocale, getMessages} from 'next-intl/server';
import './globals.css';
import { CheckpointsProvider } from '../utils/context/ContextCheckpoint';
import { EventProvider } from '../utils/context/ContextEvent';
import { MapProvider } from '../utils/context/ContextMap';
import { SessionProvider } from '../utils/context/ContextSession';

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
          <SessionProvider>
            <MapProvider>
              <EventProvider>
                <CheckpointsProvider>{children}</CheckpointsProvider>
              </EventProvider>
            </MapProvider>
          </SessionProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
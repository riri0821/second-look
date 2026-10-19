import Head from 'expo-router/head';

// Page title and description for the web version and link previews. Keep descriptions under 155 characters.
export default function PageMeta({ title, description }) {
  return (
    <Head>
      <title>{title ? `${title} | Second Look` : 'Second Look'}</title>
      <meta name="description" content={description} />
    </Head>
  );
}

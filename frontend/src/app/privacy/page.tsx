export default function PrivacyPage() {
  return (
    <main className="min-h-screen max-w-3xl mx-auto px-6 py-20 space-y-10">
      <h1 className="text-4xl font-bold text-center">Privacy Policy</h1>
      <p className="text-zinc-600 dark:text-zinc-300 text-center text-lg">
        Your privacy matters. Here’s how Lassen collects, uses, and protects
        your data.
      </p>

      <section className="space-y-6 text-zinc-700 dark:text-zinc-300">
        <div>
          <h2 className="text-2xl font-semibold">1. Data We Collect</h2>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Email and password (only for login & authentication)</li>
            <li>Uploaded images (used temporarily for ingredient detection)</li>
            <li>Saved recipes (if you choose to save them)</li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-semibold">2. How We Use It</h2>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>To detect ingredients and recommend recipes</li>
            <li>To let you save and revisit your favorite dishes</li>
            <li>To improve user experience through anonymized data insights</li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-semibold">3. What We Don’t Do</h2>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>No selling of your data — ever</li>
            <li>No spam or unsolicited emails</li>
            <li>No storage of image data after processing</li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-semibold">4. Your Rights</h2>
          <p className="mt-2">
            You can delete your account and saved data at any time. Reach out at
            <a
              href="mailto:lassen@arryan.xyz"
              className="text-blue-600 hover:underline ml-1"
            >
              lassen@arryan.xyz
            </a>
          </p>
        </div>
      </section>

      <footer className="text-sm text-zinc-400 dark:text-zinc-500 text-center pt-10">
        Last updated: May 2025
      </footer>
    </main>
  );
}

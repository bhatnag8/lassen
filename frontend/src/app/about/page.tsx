export default function AboutPage() {
  return (
    <main className="min-h-screen max-w-3xl mx-auto px-6 py-20 text-center space-y-10">
      <h1 className="text-4xl font-bold">About Lassen</h1>
      <p className="text-lg text-zinc-600 dark:text-zinc-300">
        Lassen is a next-generation recipe discovery platform that helps you
        turn photos or lists of ingredients into delicious meal suggestions. It
        combines cutting-edge AI with a beautifully minimal interface — perfect
        for food lovers, students, and busy professionals alike.
      </p>
      <div className="border border-zinc-200 dark:border-zinc-700 rounded-lg p-6 shadow-sm bg-white dark:bg-zinc-900 text-left space-y-4">
        <h2 className="text-2xl font-semibold">What We Do</h2>
        <ul className="list-disc list-inside text-zinc-700 dark:text-zinc-300 space-y-2">
          <li>🔍 Detects ingredients in your food photos</li>
          <li>🧠 Uses OpenAI to filter and clean ingredient names</li>
          <li>📖 Finds curated recipes from Spoonacular</li>
          <li>💾 Lets you save favorites with one click</li>
        </ul>
      </div>
      <footer className="text-sm text-zinc-400 dark:text-zinc-500 pt-10">
        Built with 💻 + 🍜 by Arryan Bhatnagar. Powered by Clarifai, OpenAI, and
        Spoonacular.
      </footer>
    </main>
  );
}

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
        <p className="mb-4 text-gray-700"></p>
        <p className="mb-4 text-gray-700">
          PopMitra (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) respects
          your privacy. This Privacy Policy explains how we handle your
          information when you use our application and website.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">
          1. Information We Collect
        </h2>
        <ul className="list-disc list-inside mb-4 text-gray-700">
          <li>
            <strong>User Input:</strong> Text you enter into PopMitra is
            processed by AI (Google Gemini API) to generate responses.
          </li>
          <li>
            <strong>Usage Data:</strong> We may collect non-personal technical
            information like browser type, device, and general usage analytics
            (if enabled).
          </li>
          <li>
            <strong>No Personal Accounts:</strong> We do not require you to
            create an account or provide personal details to use PopMitra.
          </li>
        </ul>

        <h2 className="text-xl font-semibold mt-6 mb-2">
          2. How We Use Information
        </h2>
        <p className="mb-4 text-gray-700">We use the information to:</p>
        <ul className="list-disc list-inside mb-4 text-gray-700">
          <li>Generate content (titles, descriptions, hashtags) using AI.</li>
          <li>Improve app performance and user experience.</li>
          <li>Monitor app usage and fix errors.</li>
        </ul>

        <h2 className="text-xl font-semibold mt-6 mb-2">3. Data Sharing</h2>
        <ul className="list-disc list-inside mb-4 text-gray-700">
          <li>
            <strong>AI Processing:</strong> User input is sent to Google Gemini
            API for content generation.
          </li>
          <li>
            <strong>No Selling of Data:</strong> We do not sell, rent, or trade
            your information.
          </li>
          <li>
            <strong>Third-Party Services:</strong> Hosting is provided by
            Vercel, which may collect basic technical data for security and
            performance.
          </li>
        </ul>

        <h2 className="text-xl font-semibold mt-6 mb-2">4. Data Security</h2>
        <p className="mb-4 text-gray-700">
          We take reasonable steps to protect information. However, no method of
          transmission over the internet is 100% secure.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">
          5. Children&apos;s Privacy
        </h2>
        <p className="mb-4 text-gray-700">
          PopMitra is not intended for children under 13 years of age.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">
          6. Changes to Privacy Policy
        </h2>
        <p className="mb-4 text-gray-700">
          We may update this Privacy Policy from time to time. The latest
          version will always be available on this page.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">7. Contact Us</h2>
        <p className="mb-4 text-gray-700">
          If you have any questions about this Privacy Policy, contact us at{" "}
          <a
            href="mailto:redcoder008@gmail.com"
            className="text-blue-500 underline"
          >
            redcoder008@gmail.com
          </a>
          .
        </p>

        <div className="mt-8">
          <a href="/" className="text-blue-500 underline hover:text-blue-700">
            Return to Home
          </a>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;

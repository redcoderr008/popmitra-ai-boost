// CookiePolicy.tsx
import React from "react";

const CookiePolicy: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-6">🍪 Cookie Policy</h1>

      <p className="text-sm text-gray-500 mb-8">
        Effective Date: 29-09-2025 | Last Updated: Date: 29-09-2025
      </p>

      <p className="mb-6">
        <strong>PopMitra</strong> uses cookies and similar tracking technologies
        to improve user experience, analyze usage, and provide personalized
        services. By using our platform, you agree to the use of cookies as
        described in this policy.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">1. What Are Cookies?</h2>
      <p className="mb-6">
        Cookies are small text files stored on your device when you visit a
        website or use an app. They help us remember your preferences, improve
        functionality, and provide insights into how our services are used.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">
        2. Types of Cookies We Use
      </h2>
      <ul className="list-disc list-inside mb-6 space-y-2">
        <li>
          <strong>Essential Cookies</strong> – Required for core functionality
          such as login, navigation, and security.
        </li>
        <li>
          <strong>Performance Cookies</strong> – Collect information about how
          users interact with our platform to improve speed and usability.
        </li>
        <li>
          <strong>Functional Cookies</strong> – Remember your preferences and
          settings (e.g., language, theme).
        </li>
        <li>
          <strong>Analytics & Advertising Cookies</strong> – Help us understand
          user behavior and deliver personalized ads (if applicable).
        </li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-4">
        3. How We Use Cookies
      </h2>
      <p className="mb-6">We use cookies to:</p>
      <ul className="list-disc list-inside mb-6 space-y-2">
        <li>Keep you signed in securely.</li>
        <li>Store user preferences.</li>
        <li>Analyze app/website performance.</li>
        <li>Improve content and features.</li>
        <li>Provide personalized recommendations or ads (where applicable).</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-4">
        4. Third-Party Cookies
      </h2>
      <p className="mb-6">
        Some cookies may be placed by trusted third-party services such as
        analytics providers, payment processors, or advertising networks. We do
        not control these cookies and recommend reviewing their respective
        policies.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">5. Managing Cookies</h2>
      <p className="mb-6">
        You can control or disable cookies through your browser or device
        settings. Please note that disabling cookies may affect certain features
        and overall functionality of our platform.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">
        6. Updates to This Policy
      </h2>
      <p className="mb-6">
        We may update this Cookie Policy from time to time. Changes will be
        reflected with a new “Last Updated” date. Continued use of our services
        indicates acceptance of the updated policy.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">7. Contact Us</h2>
      <p className="mb-6">
        If you have questions about our Cookie Policy, please contact us at:
      </p>
      <ul className="list-disc list-inside space-y-2">
        <li>
          📧 <strong>Email:</strong> redcoder008@gmail.com
        </li>
        <li>
          🌐 <strong>Website/App:</strong>{" "}
          <a href="https://popmitra.vercel.app">PopMitra</a>
        </li>
      </ul>
    </div>
  );
};

export default CookiePolicy;

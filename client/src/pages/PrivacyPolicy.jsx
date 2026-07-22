import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>

      <p className="mb-4 text-gray-600">
        Last Updated: June 4, 2026
      </p>

      <p className="mb-6">
        Welcome to our website. We respect your privacy and are committed to
        protecting any personal information you provide while using our
        services.
      </p>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">
          1. Information We Collect
        </h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Name and contact information.</li>
          <li>Email address.</li>
          <li>Account and profile information.</li>
          <li>Device and browser information.</li>
          <li>Usage data and website analytics.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">
          2. How We Use Your Information
        </h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Provide and maintain our services.</li>
          <li>Improve user experience.</li>
          <li>Respond to customer support requests.</li>
          <li>Send important updates and notifications.</li>
          <li>Protect against fraud and security threats.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">
          3. Cookies
        </h2>
        <p>
          We may use cookies and similar technologies to improve website
          functionality, remember user preferences, and analyze traffic.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">
          4. Sharing Information
        </h2>
        <p>
          We do not sell your personal information. Information may be shared
          with trusted service providers when necessary to operate our
          services or comply with legal obligations.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">
          5. Data Security
        </h2>
        <p>
          We implement reasonable security measures to protect your data.
          However, no method of transmission over the internet is completely
          secure.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">
          6. Third-Party Services
        </h2>
        <p>
          Our website may contain links to third-party services. We are not
          responsible for their privacy practices or content.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">
          7. Your Rights
        </h2>
        <p>
          You may request access, correction, or deletion of your personal
          information by contacting us.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">
          8. Changes to This Policy
        </h2>
        <p>
          We may update this Privacy Policy from time to time. Changes will be
          posted on this page with an updated revision date.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-3">
          9. Contact Us
        </h2>
        <p>Email: support@yourwebsite.com</p>
        <p>Phone: +234 XXX XXX XXXX</p>
      </section>
    </div>
  );
};

export default PrivacyPolicy;
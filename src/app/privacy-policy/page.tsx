import ServicePage from "../components/ServicePage";

export default function PrivacyPolicyPage() {
  return <ServicePage title="Privacy Policy" eyebrow="Customer Service" intro="We respect your privacy and explain how your information is used at Ruman Mart." sections={[
    { heading: "Information we collect", paragraphs: ["We may collect information you provide during checkout or when contacting us, such as your name, phone number, email address and delivery details."] },
    { heading: "How we use information", paragraphs: ["Your information helps us confirm orders, arrange delivery, provide support and improve our products and services."] },
    { heading: "Cookies", paragraphs: ["Necessary cookies support core store features, such as secure sessions, and remember your cookie choice. When prompted, you can allow all cookies or choose necessary cookies only."] },
    { heading: "Information protection", paragraphs: ["We take reasonable steps to protect your personal information and limit access to people who need it to provide our services."] },
    { heading: "Your choices", paragraphs: ["You can contact us to ask questions about your information or request an update to the contact details associated with your order."] },
  ]} />;
}

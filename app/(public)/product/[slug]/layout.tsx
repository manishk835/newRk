export default function ProductLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Product",
              name: "Product Name",
              offers: {
                "@type": "Offer",
                priceCurrency: "INR",
                availability: "https://schema.org/InStock",
              },
            }),
          }}
        />
        {children}
      </>
    );
  }
  
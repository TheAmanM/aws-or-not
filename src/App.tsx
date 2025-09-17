import AWSCard from "./components/AWSCard";
import Footer from "./components/Footer";
import Header from "./components/Header";

function App() {
  return (
    <main className="flex flex-col h-svh w-svw">
      <Header />
      <section className="mt-8 px-4">
        <h2 className="text-2xl lg:text-3xl text-center font-normal">
          Which one is the real AWS service?
        </h2>
      </section>
      <section className="flex-1 flex max-lg:flex-col items-center justify-center gap-4 lg:gap-16">
        <AWSCard
          title="Real AWS Service"
          description="Amazon Aurora is a MySQL and PostgreSQL-compatible relational database built for the cloud, that combines the performance and availability of high-end commercial databases with the simplicity and cost-effectiveness of open source databases."
        />
        <p className="text-[#888]">or</p>
        <AWSCard />
      </section>
      <Footer />
    </main>
  );
}

export default App;

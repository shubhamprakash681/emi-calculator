import React from "react";
import { EMICalculator, Header } from "./components";

const App: React.FC = () => {
  return (
    <div className="app-container bg-background text-foreground selection:bg-primary/80 dark:selection:bg-primary selection:text-primary-foreground">
      <Header />

      <div className="outer-bottom">
        <main className="page-container flex items-center justify-evenly min-h-fit min-w-[380px] px-0 sm:px-4 md:px-6 py-8 sm:py-12 md:py-16 lg:py-20">
          <EMICalculator />
        </main>
      </div>
    </div>
  );
};

export default App;

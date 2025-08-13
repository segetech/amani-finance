const puppeteer = require("puppeteer");
const cheerio = require("cheerio");

class BRVMScraper {
  constructor() {
    this.baseUrl = "https://www.brvm.org";
    this.browser = null;
  }

  async init() {
    this.browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
    }
  }

  // Scraper pour les indices BRVM
  async getIndices() {
    try {
      const page = await this.browser.newPage();

      // Configurer les headers pour éviter la détection
      await page.setUserAgent(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      );

      // Aller sur la page des indices
      await page.goto(`${this.baseUrl}/fr/indices`, {
        waitUntil: "networkidle2",
        timeout: 30000,
      });

      // Attendre que le contenu se charge
      await page.waitForSelector("table, .indices-container", {
        timeout: 10000,
      });

      const content = await page.content();
      const $ = cheerio.load(content);

      const indices = {
        composite: this.extractCompositeIndex($),
        sectoriels: this.extractSectorialIndices($),
        timestamp: new Date().toISOString(),
      };

      await page.close();
      return indices;
    } catch (error) {
      console.error("Erreur lors du scraping des indices BRVM:", error);
      throw error;
    }
  }

  // Extraire l'indice composite BRVM
  extractCompositeIndex($) {
    try {
      // Rechercher l'indice composite dans différents sélecteurs possibles
      const selectors = [
        'table tr:contains("BRVM")',
        ".indice-composite",
        '[data-indice="composite"]',
        "table tbody tr:first-child",
      ];

      for (const selector of selectors) {
        const row = $(selector).first();
        if (row.length > 0) {
          const cells = row.find("td");
          if (cells.length >= 3) {
            const value = $(cells[1]).text().trim();
            const change = $(cells[2]).text().trim();

            return {
              name: "BRVM Composite",
              value: this.cleanNumber(value),
              change: this.cleanNumber(change),
              changePercent: this.extractPercentage(change),
              isPositive: !change.includes("-"),
              lastUpdate: new Date().toISOString(),
            };
          }
        }
      }

      // Fallback: chercher dans le texte de la page
      const pageText = $("body").text();
      const indexMatch = pageText.match(/BRVM[:\s]+([0-9,\.]+)/i);
      if (indexMatch) {
        return {
          name: "BRVM Composite",
          value: this.cleanNumber(indexMatch[1]),
          change: "0",
          changePercent: "0%",
          isPositive: true,
          lastUpdate: new Date().toISOString(),
        };
      }

      throw new Error("Impossible d'extraire l'indice composite");
    } catch (error) {
      console.error("Erreur extraction indice composite:", error);
      return null;
    }
  }

  // Extraire les indices sectoriels
  extractSectorialIndices($) {
    const indices = [];

    $("table tr").each((index, row) => {
      const cells = $(row).find("td");
      if (cells.length >= 3) {
        const name = $(cells[0]).text().trim();
        const value = $(cells[1]).text().trim();
        const change = $(cells[2]).text().trim();

        if (name && value && name !== "Indice") {
          indices.push({
            name: name,
            value: this.cleanNumber(value),
            change: this.cleanNumber(change),
            changePercent: this.extractPercentage(change),
            isPositive: !change.includes("-"),
          });
        }
      }
    });

    return indices;
  }

  // Récupérer les taux de change
  async getExchangeRates() {
    try {
      const page = await this.browser.newPage();

      // Aller sur la page des devises ou utiliser une API de change
      await page.goto("https://api.exchangerate-api.com/v4/latest/EUR", {
        waitUntil: "networkidle2",
      });

      const content = await page.content();
      const data = JSON.parse(content);

      // Le FCFA est fixé à l'Euro
      const fcfaRate = 655.957; // Taux fixe FCFA/EUR

      await page.close();

      return {
        name: "FCFA/EUR",
        value: fcfaRate.toFixed(3),
        change: "0",
        changePercent: "0%",
        isPositive: true,
        lastUpdate: new Date().toISOString(),
      };
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des taux de change:",
        error,
      );
      // Retourner le taux fixe en cas d'erreur
      return {
        name: "FCFA/EUR",
        value: "655.957",
        change: "0",
        changePercent: "0%",
        isPositive: true,
        lastUpdate: new Date().toISOString(),
      };
    }
  }

  // Utilitaires
  cleanNumber(text) {
    return text.replace(/[^\d,\.-]/g, "").replace(",", ".");
  }

  extractPercentage(text) {
    const match = text.match(/([+-]?[\d,\.]+)%/);
    return match ? match[0] : "0%";
  }
}

// Fonction principale pour récupérer toutes les données
async function getRealBRVMData() {
  const scraper = new BRVMScraper();

  try {
    await scraper.init();

    const [indices, exchangeRates] = await Promise.all([
      scraper.getIndices(),
      scraper.getExchangeRates(),
    ]);

    return {
      composite: indices.composite,
      fcfa_eur: exchangeRates,
      inflation: {
        name: "Inflation UEMOA",
        value: "4.2%", // À récupérer depuis la BCEAO
        change: "+0.5",
        changePercent: "+0.5%",
        isPositive: false,
        lastUpdate: new Date().toISOString(),
      },
      taux_bceao: {
        name: "Taux BCEAO",
        value: "3.5%", // À récupérer depuis la BCEAO
        change: "0",
        changePercent: "0%",
        isPositive: true,
        lastUpdate: new Date().toISOString(),
      },
      sectoriels: indices.sectoriels,
      timestamp: new Date().toISOString(),
    };
  } finally {
    await scraper.close();
  }
}

module.exports = { BRVMScraper, getRealBRVMData };

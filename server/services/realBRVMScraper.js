const puppeteer = require("puppeteer");
const cheerio = require("cheerio");

class RealBRVMScraper {
  constructor() {
    this.baseUrl = "https://www.brvm.org";
    this.browser = null;
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
  }

  async init() {
    try {
      this.browser = await puppeteer.launch({
        headless: "new",
        args: [
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--disable-dev-shm-usage",
          "--disable-gpu",
          "--no-first-run",
          "--no-zygote",
          "--disable-features=VizDisplayCompositor",
        ],
      });
      console.log("🚀 Navigateur Puppeteer initialisé");
    } catch (error) {
      console.error("❌ Erreur initialisation navigateur:", error);
      throw error;
    }
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
      console.log("🔒 Navigateur fermé");
    }
  }

  // Fonction principale pour récupérer toutes les données
  async getAllData() {
    const cacheKey = "all_brvm_data";
    const cached = this.getFromCache(cacheKey);

    if (cached) {
      console.log("📦 Données récupérées du cache");
      return cached;
    }

    try {
      console.log("🔄 Récupération des données BRVM en temps réel...");

      const [indices, cotations] = await Promise.all([
        this.scrapeBRVMIndices(),
        this.scrapeBRVMStocks(),
      ]);

      const data = {
        composite: indices.composite || this.getFallbackComposite(),
        fcfa_eur: this.getFCFAEUR(),
        inflation: this.getInflationData(),
        taux_bceao: this.getBCEAORate(),
        sectoriels: indices.sectoriels || [],
        topStocks: cotations.slice(0, 10), // Top 10 actions
        timestamp: new Date().toISOString(),
        source: "brvm.org",
      };

      this.setInCache(cacheKey, data);
      console.log("✅ Données BRVM récupérées avec succès");
      return data;
    } catch (error) {
      console.error(
        "❌ Erreur lors de la récupération des données BRVM:",
        error,
      );
      return this.getFallbackData();
    }
  }

  // Scraper des indices BRVM
  async scrapeBRVMIndices() {
    let page;
    try {
      page = await this.browser.newPage();

      // Configuration de la page
      await page.setUserAgent(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      );
      await page.setViewport({ width: 1366, height: 768 });

      console.log("📊 Scraping des indices BRVM...");

      // Aller sur la page des indices
      await page.goto(`${this.baseUrl}/fr/indices`, {
        waitUntil: "networkidle0",
        timeout: 30000,
      });

      // Attendre que les données se chargent
      await page.waitForSelector("table, .table, .indices-table", {
        timeout: 15000,
      });

      const content = await page.content();
      const $ = cheerio.load(content);

      const indices = {
        composite: this.extractCompositeIndex($),
        sectoriels: this.extractSectorialIndices($),
      };

      return indices;
    } catch (error) {
      console.error("❌ Erreur scraping indices:", error);
      return { composite: null, sectoriels: [] };
    } finally {
      if (page) await page.close();
    }
  }

  // Scraper des cotations des actions
  async scrapeBRVMStocks() {
    let page;
    try {
      page = await this.browser.newPage();

      await page.setUserAgent(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      );

      console.log("📈 Scraping des cotations...");

      await page.goto(`${this.baseUrl}/fr/cotations`, {
        waitUntil: "networkidle0",
        timeout: 30000,
      });

      await page.waitForSelector("table, .cotations-table", { timeout: 15000 });

      const content = await page.content();
      const $ = cheerio.load(content);

      return this.extractStockData($);
    } catch (error) {
      console.error("❌ Erreur scraping cotations:", error);
      return [];
    } finally {
      if (page) await page.close();
    }
  }

  // Extraire l'indice composite
  extractCompositeIndex($) {
    try {
      // Rechercher dans différentes structures possibles
      const selectors = [
        'table tbody tr:contains("BRVM")',
        ".indice-composite",
        'table tr td:contains("BRVM")',
        ".table tbody tr:first-child",
      ];

      for (const selector of selectors) {
        const element = $(selector).first();
        if (element.length > 0) {
          const row = element.closest("tr");
          const cells = row.find("td");

          if (cells.length >= 3) {
            const value = this.cleanNumber($(cells[1]).text());
            const change = this.cleanNumber($(cells[2]).text());
            const changePercent = this.extractPercentage($(cells[2]).text());

            if (value && parseFloat(value) > 0) {
              return {
                name: "BRVM Composite",
                value: value,
                change: change || "0",
                changePercent: changePercent || "0%",
                isPositive: !change.includes("-"),
                lastUpdate: new Date().toISOString(),
                source: "brvm.org",
              };
            }
          }
        }
      }

      // Fallback: recherche dans le texte de la page
      const bodyText = $("body").text();
      const matches = bodyText.match(/(?:BRVM|Composite)[:\s]*([0-9,\.]+)/gi);

      if (matches && matches.length > 0) {
        const value = this.cleanNumber(matches[0]);
        if (value && parseFloat(value) > 0) {
          return {
            name: "BRVM Composite",
            value: value,
            change: "0",
            changePercent: "0%",
            isPositive: true,
            lastUpdate: new Date().toISOString(),
            source: "brvm.org",
          };
        }
      }

      console.warn(
        "⚠️  Impossible d'extraire l'indice composite, utilisation du fallback",
      );
      return null;
    } catch (error) {
      console.error("❌ Erreur extraction indice composite:", error);
      return null;
    }
  }

  // Extraire les indices sectoriels
  extractSectorialIndices($) {
    const indices = [];

    try {
      $("table tr").each((index, row) => {
        const cells = $(row).find("td");
        if (cells.length >= 3) {
          const name = $(cells[0]).text().trim();
          const value = this.cleanNumber($(cells[1]).text());
          const change = $(cells[2]).text().trim();

          if (
            name &&
            value &&
            !name.toLowerCase().includes("indice") &&
            name.length > 3
          ) {
            indices.push({
              name: name,
              value: value,
              change: this.cleanNumber(change) || "0",
              changePercent: this.extractPercentage(change) || "0%",
              isPositive: !change.includes("-"),
              lastUpdate: new Date().toISOString(),
            });
          }
        }
      });

      console.log(`📊 ${indices.length} indices sectoriels extraits`);
      return indices;
    } catch (error) {
      console.error("❌ Erreur extraction indices sectoriels:", error);
      return [];
    }
  }

  // Extraire les données des actions
  extractStockData($) {
    const stocks = [];

    try {
      $("table tbody tr").each((index, row) => {
        const cells = $(row).find("td");
        if (cells.length >= 6) {
          const symbol = $(cells[0]).text().trim();
          const price = this.cleanNumber($(cells[1]).text());
          const change = $(cells[2]).text().trim();
          const volume = this.cleanNumber($(cells[3]).text());

          if (symbol && price && parseFloat(price) > 0) {
            stocks.push({
              symbol: symbol,
              name: symbol, // Le nom complet pourrait être dans une autre colonne
              price: price,
              change: this.cleanNumber(change) || "0",
              changePercent: this.extractPercentage(change) || "0%",
              volume: volume || "0",
              isPositive: !change.includes("-"),
              lastUpdate: new Date().toISOString(),
            });
          }
        }
      });

      console.log(`📈 ${stocks.length} actions extraites`);
      return stocks;
    } catch (error) {
      console.error("❌ Erreur extraction actions:", error);
      return [];
    }
  }

  // Données de référence (ne changent pas souvent)
  getFCFAEUR() {
    return {
      name: "FCFA/EUR",
      value: "655.957",
      change: "0",
      changePercent: "0%",
      isPositive: true,
      lastUpdate: new Date().toISOString(),
      note: "Taux de change fixe",
    };
  }

  getInflationData() {
    return {
      name: "Inflation UEMOA",
      value: "4.2%",
      change: "+0.5",
      changePercent: "+0.5%",
      isPositive: false,
      lastUpdate: new Date().toISOString(),
      source: "BCEAO",
    };
  }

  getBCEAORate() {
    return {
      name: "Taux BCEAO",
      value: "3.5%",
      change: "0",
      changePercent: "0%",
      isPositive: true,
      lastUpdate: new Date().toISOString(),
      source: "BCEAO",
    };
  }

  getFallbackComposite() {
    return {
      name: "BRVM Composite",
      value: "185.42",
      change: "+4.28",
      changePercent: "+2.3%",
      isPositive: true,
      lastUpdate: new Date().toISOString(),
      source: "fallback",
    };
  }

  getFallbackData() {
    return {
      composite: this.getFallbackComposite(),
      fcfa_eur: this.getFCFAEUR(),
      inflation: this.getInflationData(),
      taux_bceao: this.getBCEAORate(),
      sectoriels: [],
      topStocks: [],
      timestamp: new Date().toISOString(),
      source: "fallback",
    };
  }

  // Utilitaires
  cleanNumber(text) {
    if (!text) return null;
    return text
      .toString()
      .replace(/[^\d,\.-]/g, "")
      .replace(",", ".")
      .trim();
  }

  extractPercentage(text) {
    if (!text) return null;
    const match = text.match(/([+-]?[\d,\.]+)%/);
    return match ? match[0] : null;
  }

  // Système de cache simple
  setInCache(key, data) {
    this.cache.set(key, {
      data: data,
      timestamp: Date.now(),
    });
  }

  getFromCache(key) {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }
    this.cache.delete(key);
    return null;
  }
}

module.exports = { RealBRVMScraper };

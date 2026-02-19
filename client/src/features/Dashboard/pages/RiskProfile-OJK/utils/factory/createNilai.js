export function createNilai(mode = "Tanpa Faktor") {
  const base = {
    id: crypto.randomUUID(),
    nomor: "",
    bobot: "",
    portofolio: "",
    keterangan: "",
    riskindikator: {
      low: "",
      lowToModerate: "",
      moderate: "",
      moderateToHigh: "",
      high: "",
    },
    derived: null,
  };

  switch (mode) {
    case "Tanpa Faktor":
      return {
        ...base,
        judul: {
          type: "Tanpa Faktor",
          text: "",
          value: "",
          formula: undefined,
          percent: false,
        },
      };

    case "Satu Faktor":
      return {
        ...base,
        judul: {
          type: "Satu Faktor",
          text: "",
          pembilang: "",
          valuePembilang: "",
          formula: undefined,
          percent: false,
        },
      };

    case "Dua Faktor":
      return {
        ...base,
        judul: {
          type: "Dua Faktor",
          text: "",
          pembilang: "",
          valuePembilang: "",
          penyebut: "",
          valuePenyebut: "",
          formula: undefined,
          percent: false,
        },
      };

    default:
      throw new Error(`createNilai: mode tidak dikenali "${mode}"`);
  }
}
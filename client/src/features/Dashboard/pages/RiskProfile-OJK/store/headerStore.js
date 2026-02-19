import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ========== HELPER FUNCTIONS ==========
const deepClone = (obj) => {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime());
  if (obj instanceof Array) return obj.map((item) => deepClone(item));
  if (typeof obj === 'object') {
    const cloned = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        cloned[key] = deepClone(obj[key]);
      }
    }
    return cloned;
  }
  return obj;
};

const getPreviousQuarterInfo = (year, quarter) => {
  const quarterMap = {
    q1: { quarter: 'q4', year: year - 1 },
    q2: { quarter: 'q1', year: year },
    q3: { quarter: 'q2', year: year },
    q4: { quarter: 'q3', year: year },
  };
  return quarterMap[quarter] || { quarter: 'q4', year: year - 1 };
};

const formatQuarterLabel = (quarter) => {
  const quarterLabels = {
    q1: 'Q1',
    q2: 'Q2',
    q3: 'Q3',
    q4: 'Q4',
  };
  return quarterLabels[quarter] || quarter;
};

const getEmptyData = () => ({
  riskProfile: [],
  categories: [],
  lastUpdated: new Date().toISOString(),
  version: '1.0',
});

// ========== RISK PROFILE STORAGE OPERATIONS ==========
const copyRiskProfileData = (
  sourceYear,
  sourceQuarter,
  targetYear,
  targetQuarter,
  categoryId = null,
  dataType = null
) => {
  let copiedCount = 0;

  if (dataType === null || dataType === 'inherent') {
    const inherentPatterns = [
      `risk:${categoryId ? categoryId : '*'}:inherent:${sourceYear}:${sourceQuarter}`,
      `derived:${categoryId ? categoryId : '*'}:${sourceYear}:${sourceQuarter}`,
    ];

    inherentPatterns.forEach((pattern) => {
      const regex = new RegExp(`^${pattern.replace(/\*/g, '.*')}$`);
      Object.keys(localStorage).forEach((sourceKey) => {
        if (regex.test(sourceKey)) {
          let actualCategoryId = categoryId;
          if (!actualCategoryId) {
            const match = sourceKey.match(/risk:(.*):inherent:/) || sourceKey.match(/derived:(.*):/);
            actualCategoryId = match?.[1] || '*';
          }

          const targetKey = sourceKey.includes('inherent')
            ? `risk:${actualCategoryId}:inherent:${targetYear}:${targetQuarter}`
            : `derived:${actualCategoryId}:${targetYear}:${targetQuarter}`;

          const sourceData = localStorage.getItem(sourceKey);
          if (sourceData) {
            try {
              const parsedData = JSON.parse(sourceData);
              const clonedData = deepClone(parsedData);
              clonedData.source = `Copied from ${formatQuarterLabel(sourceQuarter)} ${sourceYear}`;
              clonedData.copiedAt = new Date().toISOString();
              clonedData.originalYear = sourceYear;
              clonedData.originalQuarter = sourceQuarter;

              localStorage.setItem(targetKey, JSON.stringify(clonedData));
              copiedCount++;
            } catch (error) {
              console.error(`Error copying ${sourceKey}:`, error);
            }
          }
        }
      });
    });
  }

  if (
    (dataType === null || dataType === 'kpmr') &&
    sourceQuarter === 'q4' &&
    targetQuarter === 'q1'
  ) {
    const kpmrPattern = `risk:${categoryId ? categoryId : '*'}:kpmr:${sourceYear}`;
    const kpmrRegex = new RegExp(`^${kpmrPattern.replace(/\*/g, '.*')}$`);

    Object.keys(localStorage).forEach((sourceKey) => {
      if (kpmrRegex.test(sourceKey)) {
        let actualCategoryId = categoryId;
        if (!actualCategoryId) {
          const match = sourceKey.match(/risk:(.*):kpmr:/);
          actualCategoryId = match?.[1] || '*';
        }

        const targetKey = `risk:${actualCategoryId}:kpmr:${targetYear}`;

        const sourceData = localStorage.getItem(sourceKey);
        if (sourceData) {
          try {
            const parsedData = JSON.parse(sourceData);
            const clonedData = deepClone(parsedData);
            clonedData.source = `Copied from KPMR ${sourceYear}`;
            clonedData.copiedAt = new Date().toISOString();

            localStorage.setItem(targetKey, JSON.stringify(clonedData));
            copiedCount++;
          } catch (error) {
            console.error(`Error copying KPMR ${sourceKey}:`, error);
          }
        }
      }
    });
  }

  window.dispatchEvent(
    new CustomEvent('riskProfileCopied', {
      detail: {
        sourceYear,
        sourceQuarter,
        targetYear,
        targetQuarter,
        count: copiedCount,
      },
    })
  );

  return copiedCount;
};

const deleteRiskProfileData = (year, quarter, categoryId = null, dataType = null) => {
  const patterns = [];
  if (dataType === null || dataType === 'inherent') {
    patterns.push(`risk:*:inherent:${year}:${quarter}`);
    patterns.push(`derived:*:${year}:${quarter}`);
  }
  if (dataType === null || dataType === 'kpmr') {
    patterns.push(`risk:*:kpmr:${year}`);
  }

  let deletedCount = 0;

  if (categoryId) {
    const specificKeys = [];
    if (dataType === null || dataType === 'inherent') {
      specificKeys.push(`risk:${categoryId}:inherent:${year}:${quarter}`);
      specificKeys.push(`derived:${categoryId}:${year}:${quarter}`);
    }
    if (dataType === null || dataType === 'kpmr') {
      specificKeys.push(`risk:${categoryId}:kpmr:${year}`);
    }

    specificKeys.forEach((key) => {
      if (localStorage.getItem(key)) {
        localStorage.removeItem(key);
        deletedCount++;
      }
    });
  } else {
    patterns.forEach((pattern) => {
      const regex = new RegExp(`^${pattern.replace(/\*/g, '.*')}$`);
      Object.keys(localStorage).forEach((key) => {
        if (regex.test(key)) {
          localStorage.removeItem(key);
          deletedCount++;
        }
      });
    });
  }

  window.dispatchEvent(
    new CustomEvent('riskProfileReset', {
      detail: { year, quarter, categoryId, count: deletedCount, dataType },
    })
  );

  return deletedCount;
};

// ========== ZUSTAND STORE ==========
export const useHeaderStore = create(
  persist(
    (set, get) => ({
      year: new Date().getFullYear(),
      activeQuarter: 'q1',
      search: '',
      availableYears: Array.from({ length: 101 }, (_, i) => 2000 + i),
      importStatus: null,
      yearData: {},

      setYear: (year) => set({ year }),
      setActiveQuarter: (quarter) => set({ activeQuarter: quarter }),
      setSearch: (search) => set({ search }),
      requestExport: () => console.log('Export requested'),
      setImportStatus: (status) => set({ importStatus: status }),

      addYear: (year) =>
        set((state) => ({
          availableYears: state.availableYears.includes(year)
            ? state.availableYears
            : [...state.availableYears, year].sort((a, b) => a - b),
        })),

      resetQuarterData: (year, quarter) =>
        set((state) => {
          const newYearData = { ...state.yearData };
          if (!newYearData[year]) return { yearData: newYearData };
          delete newYearData[year][quarter];
          if (Object.keys(newYearData[year]).length === 0) delete newYearData[year];
          return { yearData: newYearData };
        }),

      copyFromPreviousQuarter: (targetYear, targetQuarter) => {
        const { quarter: sourceQuarter, year: sourceYear } = getPreviousQuarterInfo(
          targetYear,
          targetQuarter
        );
        if (sourceYear < 2000 || sourceYear > 2100) {
          console.error(`Tahun sumber ${sourceYear} di luar range yang diizinkan`);
          return false;
        }

        const state = get();
        let sourceData;
        if (state.yearData[sourceYear]?.[sourceQuarter]) {
          sourceData = state.yearData[sourceYear][sourceQuarter];
        } else {
          sourceData = getEmptyData();
          if (!state.yearData[sourceYear]) state.yearData[sourceYear] = {};
          state.yearData[sourceYear][sourceQuarter] = sourceData;
          set({ yearData: { ...state.yearData } });
        }

        const clonedData = deepClone(sourceData);
        clonedData.source = `Copied from ${formatQuarterLabel(sourceQuarter)} ${sourceYear}`;
        clonedData.copiedAt = new Date().toISOString();
        clonedData.originalQuarter = targetQuarter;
        clonedData.originalYear = targetYear;

        set((state) => ({
          yearData: {
            ...state.yearData,
            [targetYear]: {
              ...state.yearData[targetYear],
              [targetQuarter]: clonedData,
            },
          },
        }));

        return true;
      },

      // Method untuk menyalin data risk profile (tanpa konfirmasi/alert)
      performCopyFromPreviousQuarter: async (targetYear, targetQuarter, categoryId = null, dataType = null) => {
        const { quarter: sourceQuarter, year: sourceYear } = getPreviousQuarterInfo(
          targetYear,
          targetQuarter
        );
        const copiedCount = copyRiskProfileData(
          sourceYear,
          sourceQuarter,
          targetYear,
          targetQuarter,
          categoryId,
          dataType
        );
        return { copiedCount, sourceYear, sourceQuarter };
      },

      // Method untuk mereset data risk profile (tanpa konfirmasi/alert)
      performResetQuarter: (year, quarter, categoryId = null, dataType = null) => {
        const deletedCount = deleteRiskProfileData(year, quarter, categoryId, dataType);
        return { deletedCount };
      },

      // Fungsi kompatibilitas lama (tetap ada, tidak digunakan di header baru)
      copyRiskProfileFromPrevious: (targetYear, targetQuarter) => {
        const { quarter: sourceQuarter, year: sourceYear } = getPreviousQuarterInfo(
          targetYear,
          targetQuarter
        );
        const copiedCount = copyRiskProfileData(
          sourceYear,
          sourceQuarter,
          targetYear,
          targetQuarter
        );
        return { success: true, copiedCount };
      },

      resetRiskProfileData: (year, quarter, categoryId = null) => {
        const deletedCount = deleteRiskProfileData(year, quarter, categoryId);
        return { success: true, deletedCount };
      },

      copyAllFromPreviousQuarter: async (targetYear, targetQuarter) => {
        const { quarter: sourceQuarter, year: sourceYear } = getPreviousQuarterInfo(
          targetYear,
          targetQuarter
        );
        const internalCopySuccess = get().copyFromPreviousQuarter(targetYear, targetQuarter);
        const riskProfileCopyResult = get().copyRiskProfileFromPrevious(targetYear, targetQuarter);
        return {
          internalCopy: internalCopySuccess,
          riskProfileCopy: riskProfileCopyResult.success,
          totalCopied: riskProfileCopyResult.copiedCount,
        };
      },

      importDataFromFile: async (file, targetYear, targetQuarter) => {
        if (!file) throw new Error('Tidak ada file');

        set({ importStatus: 'reading' });

        try {
          const fileContent = await file.text();
          const parsedData = JSON.parse(fileContent);

          if (!parsedData || typeof parsedData !== 'object') {
            throw new Error('Invalid file format');
          }

          set({ importStatus: 'processing' });

          // Import internal data
          let internalData = null;
          if (parsedData.internalData) {
            internalData = deepClone(parsedData.internalData);
            internalData.importedAt = new Date().toISOString();
            internalData.source = 'Imported from file';
            internalData.originalYear = targetYear;
            internalData.originalQuarter = targetQuarter;

            set((state) => ({
              yearData: {
                ...state.yearData,
                [targetYear]: {
                  ...state.yearData[targetYear],
                  [targetQuarter]: internalData,
                },
              },
            }));
          }

          // Import risk profile data
          let riskProfileResult = { importedCount: 0, errors: [] };
          if (parsedData.riskProfileData && Array.isArray(parsedData.riskProfileData)) {
            riskProfileResult = (() => {
              let importedCount = 0;
              let errors = [];
              parsedData.riskProfileData.forEach((item, index) => {
                try {
                  if (!item.categoryId || !item.dataType) {
                    errors.push(`Item ${index}: missing categoryId or dataType`);
                    return;
                  }

                  let storageKey;
                  if (item.dataType === 'inherent') {
                    storageKey = `risk:${item.categoryId}:inherent:${targetYear}:${targetQuarter}`;
                  } else if (item.dataType === 'derived') {
                    storageKey = `derived:${item.categoryId}:${targetYear}:${targetQuarter}`;
                  } else if (item.dataType === 'kpmr') {
                    storageKey = `risk:${item.categoryId}:kpmr:${targetYear}`;
                  } else {
                    errors.push(`Item ${index}: invalid dataType "${item.dataType}"`);
                    return;
                  }

                  if (!item.data) {
                    errors.push(`Item ${index}: missing data`);
                    return;
                  }

                  const dataWithMeta = {
                    ...deepClone(item.data),
                    importedAt: new Date().toISOString(),
                    source: 'Imported from file',
                    originalYear: item.originalYear || targetYear,
                    originalQuarter: item.originalQuarter || targetQuarter,
                  };

                  localStorage.setItem(storageKey, JSON.stringify(dataWithMeta));
                  importedCount++;
                } catch (error) {
                  errors.push(`Item ${index}: ${error.message}`);
                }
              });
              return { importedCount, errors };
            })();
          }

          set({ importStatus: 'completed' });

          setTimeout(() => {
            window.dispatchEvent(
              new CustomEvent('dataImported', {
                detail: { targetYear, targetQuarter },
              })
            );
          }, 100);

          return {
            success: true,
            internalData: !!internalData,
            riskProfileImported: riskProfileResult.importedCount,
            errors: riskProfileResult.errors,
          };
        } catch (error) {
          console.error('Import error:', error);
          set({ importStatus: 'error' });
          throw error;
        }
      },

      triggerImport: (targetYear = null, targetQuarter = null) => {
        return new Promise((resolve, reject) => {
          const year = targetYear || get().year;
          const quarter = targetQuarter || get().activeQuarter;

          const input = document.createElement('input');
          input.type = 'file';
          input.accept = '.json';

          input.onchange = async (e) => {
            const file = e.target.files[0];
            if (!file) {
              resolve({ cancelled: true });
              return;
            }
            try {
              const result = await get().importDataFromFile(file, year, quarter);
              resolve(result);
            } catch (error) {
              reject(error);
            }
          };

          input.oncancel = () => {
            resolve({ cancelled: true });
          };

          input.click();
        });
      },

      getQuarterData: (year, quarter) => {
        const state = get();
        return state.yearData[year]?.[quarter] || null;
      },

      setQuarterData: (year, quarter, data) =>
        set((state) => ({
          yearData: {
            ...state.yearData,
            [year]: {
              ...state.yearData[year],
              [quarter]: data,
            },
          },
        })),
    }),
    {
      name: 'header-storage',
      partialize: (state) => ({
        year: state.year,
        activeQuarter: state.activeQuarter,
        availableYears: state.availableYears,
        yearData: state.yearData,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          console.log(
            'Storage berhasil di-load:',
            Object.keys(state.yearData || {}).length,
            'tahun tersimpan'
          );
        }
      },
    }
  )
);
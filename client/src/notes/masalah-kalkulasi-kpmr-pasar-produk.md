Masalah:
Tidak menghitung bobot - hanya rata-rata sederhana, bukan weighted average

Rating sistem terbalik - skor tinggi = Unsatisfactory (seharusnya Strong)

Tidak ada kalkulasi untuk summary KPMR secara keseluruhan

Perbaikan Kalkulasi yang Benar:
Tambahkan di TableKpmr Component:
javascript
// Fungsi untuk menghitung weighted average dengan bobot
const calculateWeightedAverage = (aspek, quarter) => {
  const list = aspek.pertanyaanList || [];
  if (list.length === 0) return '-';

  const skorValues = list
    .map((q) => {
      const skorValue = q.skor?.[quarter] || q.skor?.[quarter.toLowerCase()];
      if (skorValue !== '' && skorValue !== undefined && skorValue !== null) {
        const num = Number(skorValue);
        if (num >= 1 && num <= 5) return num;
      }
      return null;
    })
    .filter((v) => v !== null);

  if (skorValues.length === 0) return '-';

  // Rata-rata sederhana (karena tidak ada bobot per pertanyaan)
  const avg = skorValues.reduce((a, b) => a + b, 0) / skorValues.length;
  return parseFloat(avg.toFixed(2));
};

// Fungsi untuk menghitung rata-rata KPMR dengan bobot aspek
const calculateKpmrAverage = (quarter) => {
  if (normalizedRows.length === 0) return '-';

  const validAspek = normalizedRows.filter(aspek => {
    const avg = calculateWeightedAverage(aspek, quarter);
    return avg !== '-' && aspek.bobot > 0;
  });

  if (validAspek.length === 0) return '-';

  // Hitung weighted average berdasarkan bobot aspek
  const totalBobot = validAspek.reduce((sum, aspek) => sum + aspek.bobot, 0);
  const weightedSum = validAspek.reduce((sum, aspek) => {
    const avg = calculateWeightedAverage(aspek, quarter);
    return sum + (avg * aspek.bobot);
  }, 0);

  if (totalBobot === 0) return '-';
  
  const result = weightedSum / totalBobot;
  return parseFloat(result.toFixed(2));
};

// Fungsi untuk mendapatkan rating berdasarkan skor
const getRatingFromScore = (score) => {
  const num = Number(score);
  if (num >= 4.5) return 'Strong';
  if (num >= 3.5) return 'Satisfactory';
  if (num >= 2.5) return 'Fair';
  if (num >= 1.5) return 'Marginal';
  if (num > 0) return 'Unsatisfactory';
  return 'N/A';
};

// Fungsi untuk menghitung global summary dengan benar
const calculateGlobalSummaryCorrected = () => {
  const result = {};
  
  selectedQuarters.forEach((quarter) => {
    const kpmrAvg = calculateKpmrAverage(quarter);
    result[quarter] = kpmrAvg === '-' ? '-' : {
      score: kpmrAvg,
      rating: getRatingFromScore(kpmrAvg),
      color: skorBg(kpmrAvg)
    };
  });

  return result;
};
Perbaikan di Tampilan Table:
javascript
// Ganti pemanggilan calculateGlobalSummary dengan yang baru
const globalSummary = calculateGlobalSummaryCorrected();

// Di dalam render:
{hasSelectedQuarters && (
  <tr className="font-bold">
    <td colSpan={2}>
      <div className="border border-black px-2 py-2 text-center font-semibold text-white bg-blue-900">
        Summary (Weighted Average)
      </div>
    </td>
    {selectedQuarters.map((quarter) => {
      const summary = globalSummary[quarter];
      const hasValue = summary !== '-' && typeof summary === 'object';
      
      return (
        <td 
          key={quarter} 
          className={`border border-black px-2 py-2 text-center ${hasValue ? summary.color : ''}`}
          title={hasValue ? `Rating: ${summary.rating}` : 'Tidak ada data'}
        >
          <div className="font-bold">
            {hasValue ? summary.score : '-'}
          </div>
          {hasValue && (
            <div className="text-xs font-normal">
              {summary.rating}
            </div>
          )}
        </td>
      );
    })}
    <td colSpan={6} className="border border-white"></td>
  </tr>
)}
Tambahkan Kalkulasi di AspekPanel atau KpmrPage:
javascript
// Fungsi untuk menghitung dan menyimpan summary ke backend
const calculateAndSaveSummary = async (rowsData) => {
  try {
    // Hitung untuk setiap quarter
    const summary = {};
    ['Q1', 'Q2', 'Q3', 'Q4'].forEach(quarter => {
      const avg = calculateKpmrAverageForRows(rowsData, quarter);
      if (avg !== '-') {
        summary[quarter] = {
          score: avg,
          rating: getRatingFromScore(avg),
          calculatedAt: new Date().toISOString()
        };
      }
    });

    // Kirim ke backend
    const response = await fetch(`/api/kpmr/${kpmrId}/summary`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        totalScore: rowsData.reduce((sum, aspek) => sum + (aspek.averageScore || 0), 0),
        averageScore: calculateOverallAverage(rowsData),
        rating: getRatingFromScore(calculateOverallAverage(rowsData)),
        quarterlySummary: summary,
        computedAt: new Date().toISOString()
      })
    });

    if (!response.ok) {
      throw new Error('Failed to save summary');
    }

    return true;
  } catch (error) {
    console.error('Error calculating summary:', error);
    return false;
  }
};

// Helper functions
const calculateKpmrAverageForRows = (rows, quarter) => {
  if (!rows || rows.length === 0) return '-';

  const validAspek = rows.filter(aspek => {
    const avg = calculateWeightedAverage(aspek, quarter);
    return avg !== '-' && aspek.bobot > 0;
  });

  if (validAspek.length === 0) return '-';

  const totalBobot = validAspek.reduce((sum, aspek) => sum + aspek.bobot, 0);
  const weightedSum = validAspek.reduce((sum, aspek) => {
    const avg = calculateWeightedAverage(aspek, quarter);
    return sum + (avg * aspek.bobot);
  }, 0);

  if (totalBobot === 0) return '-';
  
  return parseFloat((weightedSum / totalBobot).toFixed(2));
};

const calculateOverallAverage = (rows) => {
  const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];
  const quarterAverages = quarters
    .map(q => calculateKpmrAverageForRows(rows, q))
    .filter(avg => avg !== '-')
    .map(Number);

  if (quarterAverages.length === 0) return 0;
  
  const total = quarterAverages.reduce((sum, avg) => sum + avg, 0);
  return parseFloat((total / quarterAverages.length).toFixed(2));
};
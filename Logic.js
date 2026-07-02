// 1. Nhúng các hàm cần thiết từ CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// 2. Chìa khóa cấu hình chuẩn đét bạn vừa giữ lại
const firebaseConfig = {
  apiKey: "AIzaSyC6SB_1tMRZOVWolfAoJpvk_sFr51y9BBY",
  authDomain: "jvmelaffeyz.firebaseapp.com",
  projectId: "jvmelaffeyz",
  storageBucket: "jvmelaffeyz.firebasestorage.app",
  messagingSenderId: "255377099587",
  appId: "1:255377099587:web:2b1150a8a1e8203e2afdf6",
  measurementId: "G-3VFM46HFDQ"
};

// 3. Khởi tạo
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 4. Hàm xử lý tính toán "Summary of Data" bằng JavaScript thuần
function analyzeData(numbersArray) {
  if (!numbersArray || numbersArray.length === 0) return null;
  
  // Sắp xếp mảng tăng dần để tính toán
  const sorted = [...numbersArray].sort((a, b) => a - b);
  const count = sorted.length;
  
  // Tính Số trung bình (Mean)
  const mean = sorted.reduce((sum, val) => sum + val, 0) / count;
  
  // Tính Trung vị (Median)
  const mid = Math.floor(count / 2);
  const median = count % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
  
  // Tính Phương sai (Variance) & Độ lệch chuẩn (Standard Deviation)
  const variance = sorted.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / count;
  const stDev = Math.sqrt(variance);

  return {
    count: count,
    mean: Number(mean.toFixed(2)),
    median: Number(median.toFixed(2)),
    min: sorted[0],
    max: sorted[count - 1],
    range: sorted[count - 1] - sorted[0],
    standardDeviation: Number(stDev.toFixed(2))
  };
}

// 5. Hàm lõi đẩy toàn bộ kết quả lên bảng Firestore vừa tạo
async function saveAnalysisToFirebase(title, rawData) {
  try {
    const summary = analyzeData(rawData);
    if (!summary) return;

    const documentData = {
      title: title,
      rawData: rawData,
      summary: summary,
      createdAt: new Date().toISOString()
    };

    // Tự động tạo collection tên là 'data_summaries' trên Firebase của bạn
    const docRef = await addDoc(collection(db, "data_summaries"), documentData);
    console.log("Đã lưu lên Firestore thành công! ID:", docRef.id);
    
  } catch (error) {
    console.error("Lỗi khi đẩy dữ liệu:", error);
  }
}

// === CHẠY THỬ NGHIỆM LIỀN CHO NÓNG ===
// Bạn mở F12 trên trình duyệt lên xem báo Log nhé!
saveAnalysisToFirebase("Dữ liệu đo bán dẫn - Kíp 1", [12.5, 13.2, 12.8, 14.1, 11.9, 13.2]);
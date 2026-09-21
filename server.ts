import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // AI Tutor endpoint for SQL error explanation & hints
  app.post("/api/ai-tutor", async (req, res) => {
    try {
      const { sql, error, context, question, tableSchemas } = req.body;

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(200).json({
          advice: "Trợ lý AI chưa có API Key. Bạn hãy kiểm tra lại cú pháp SQL Server (T-SQL) theo bảng gợi ý nhé!",
          hint: "Kiểm tra dấu phẩy, tên bảng trong ngoặc vuông [ ], và thứ tự mệnh đề: SELECT -> FROM -> WHERE -> GROUP BY -> HAVING -> ORDER BY.",
          isMock: true
        });
      }

      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });

      const prompt = `Bạn là một giáo viên dạy môn Tin học trường THPT có nhiều năm kinh nghiệm, ân cần, giải thích sư phạm, dễ hiểu cho học sinh lớp 11-12 về môn Cơ sở Dữ liệu & SQL Server (T-SQL).

Bối cảnh:
- Câu hỏi hoặc bài tập của học sinh: ${question || "Thực hành viết truy vấn SQL"}
- Cấu trúc bảng hiện có: ${tableSchemas || "CSDL Quản lý học sinh: [HocSinh], [Lop], [Diem]"}
- Câu lệnh SQL học sinh vừa viết:
\`\`\`sql
${sql || "Chưa có lệnh"}
\`\`\`
- Lỗi thời gian thực hệ thống báo:
${error || "Không có lỗi cú pháp, học sinh muốn được giải thích hoặc tối ưu"}
- Yêu cầu bổ sung: ${context || "Giải thích lỗi cụ thể và gợi ý sửa bằng tiếng Việt ngắn gọn, xúc tích"}

Hãy phản hồi theo phong cách giáo viên phổ thông:
1. Nhận xét ngắn gọn lỗi sai ở đâu (dòng nào, từ khóa nào, quy tắc nào của SQL Server).
2. Giải thích bản chất khái niệm (ví dụ: tại sao GROUP BY phải đi cùng các cột không tổng hợp, tại sao khóa ngoại phải trỏ đúng kiểu dữ liệu khóa chính, v.v.).
3. Hướng dẫn học sinh câu lệnh đúng chuẩn SQL Server.
4. Một lời động viên học sinh tiếp tục cố gắng!

Định dạng trả lời ngắn gọn, có gạch đầu dòng rõ ràng, tối đa 200 từ.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
      });

      res.json({
        advice: response.text || "Hãy kiểm tra lại cú pháp câu lệnh SQL Server của bạn.",
        isMock: false
      });
    } catch (err: any) {
      console.error("AI Tutor error:", err);
      res.status(200).json({
        advice: "Thầy/cô khuyên em kiểm tra lại các từ khóa SQL Server: SELECT, FROM, WHERE, GROUP BY, ORDER BY và dấu nháy đơn ' cho chuỗi văn bản.",
        hint: "Trong SQL Server, chuỗi ký tự đặt trong cặp nháy đơn '...', tên cột hoặc bảng nếu có dấu cách đặt trong ngoặc vuông [...].",
        isMock: true
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

export interface AiTutorRequest {
  sql: string;
  error?: string;
  context?: string;
  question?: string;
  tableSchemas?: string;
}

export interface AiTutorResponse {
  advice: string;
  hint?: string;
  isMock?: boolean;
}

export async function askAiTutor(payload: AiTutorRequest): Promise<AiTutorResponse> {
  try {
    const response = await fetch('/api/ai-tutor', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Server returned status ${response.status}`);
    }

    const data = await response.json();
    return {
      advice: data.advice || 'Thầy/Cô khuyên em kiểm tra lại cú pháp SQL Server.',
      hint: data.hint,
      isMock: data.isMock
    };
  } catch (err) {
    console.warn('AI Tutor fallback:', err);
    return {
      advice: 'Thầy/Cô khuyên em kiểm tra kỹ các từ khóa chính: SELECT các cột cần lấy, FROM bảng dữ liệu, WHERE điều kiện lọc chuỗi ký tự kẹp trong cặp nháy đơn N\'...\'.',
      hint: 'Trong SQL Server, hãy luôn kiểm tra tên bảng và tên cột có khớp với sơ đồ CSDL không nhé.',
      isMock: true
    };
  }
}

import { Vocabulary, ChildFeedback, VoiceOption } from "./types";

export const INITIAL_FULL_TEXT = `Nhận xét chi tiết về phát âm của hai bé:

1. Em Bắp (đóng vai Kate):
- Ưu điểm: Bé có chất giọng rất sáng, nói rõ ràng, tự tin và có ngữ điệu lên xuống khá tốt.
- Điểm cần cải thiện:
+ Âm đuôi (Ending sounds): Bé thường bị bỏ quên hoặc phát âm chưa rõ các âm đuôi quan trọng. Ví dụ: từ thanks (thiếu âm /s/), past (thiếu âm /st/ ở cuối), month (âm /θ/ chưa rõ).
+ Từ khó: Từ San Francisco có vẻ hơi dài và khó với bé nên bé bị ngập ngừng ở đoạn này. Bạn có thể hướng dẫn bé tách ra đọc chậm: San-Fran-cis-co.
+ Âm "th": Trong các từ như nothing hay month, bé phát âm âm "th" gần giống tiếng Việt.

2. Chị Hai (đóng vai người bố):
- Ưu điểm: Bé đọc có độ bình tĩnh, phát âm các từ đơn lẻ khá chuẩn và rõ chữ.
- Điểm cần cải thiện:
+ Trọng âm và ngữ điệu: Bé đọc hơi đều giọng (monotone), giống như đang đọc text hơn là đang giao tiếp thực tế.
+ Từ phát âm chưa chính xác: Từ matter (trong câu "What's the matter?"), bé phát âm nghe hơi giống "ma-thơ". Từ interesting bé đọc đủ các âm nhưng trọng âm chưa chuẩn (nên nhấn vào âm đầu tiên: In-tres-ting).

3. Gợi ý cách đọc chuẩn cho một số từ trong bài:
- Thanks: Đọc là /θæŋks/ (nhớ có âm s bật nhẹ ở cuối).
- Matter: Đọc là /ˈmæt.ər/ (âm "t" ở giữa, người Mỹ thường đọc nhẹ gần như chữ "đ" -> ma-đờ).
- Interesting: Thay vì đọc là "in-te-res-ting", hãy hướng dẫn bé đọc gọn lại thành 3 âm tiết: /ˈɪn.trə.stɪŋ/ (In-tres-ting).
- San Francisco: Đọc là /ˌsæn frənˈsɪs.koʊ/.

4. Phương pháp luyện đọc hiệu quả cho hai bé:
- Luyện "Âm đuôi" (Ending sounds) bằng trò chơi bật hơi: Nhắc các bé rằng tiếng Anh giống như có các "mật mã" ở cuối từ (như /s/, /t/, /d/). Hãy thử cùng bé thi xem ai bật được âm đuôi rõ và "tây" hơn.
- Áp dụng phương pháp Shadowing (Nhại giọng): Hãy cho hai bé nghe đoạn hội thoại gốc của người bản xứ (nếu có), sau đó bật dừng từng câu để các bé bắt chước y hệt ngữ điệu, chỗ nhấn nhá và cách nối âm của họ.
- Đổi vai và diễn cảm: Lần sau, bạn hãy cho hai bé đổi vai cho nhau. Khuyến khích các bé "diễn" hơn một chút (ví dụ: vai người bố thì cần trầm ấm, quan tâm; vai Kate khi nói a little tired thì có thể tỏ ra hơi uể oải một chút). Việc này giúp tăng phản xạ ngữ điệu tự nhiên.`;

export const CHILDREN_FEEDBACK: ChildFeedback[] = [
  {
    name: "Em Bắp",
    role: "Đóng vai Kate",
    avatar: "🌽",
    pros: [
      "Có chất giọng rất sáng, tràn đầy năng lượng.",
      "Nói rõ ràng, tự tin, phong thái tự nhiên.",
      "Có ngữ điệu lên xuống khá tốt."
    ],
    improvements: [
      {
        category: "Âm đuôi (Ending sounds)",
        details: "Thường bị bỏ quên hoặc phát âm chưa rõ các âm đuôi quan trọng.",
        exampleWords: ["thanks (thiếu /s/)", "past (thiếu /st/)", "month (thiếu /θ/)"]
      },
      {
        category: "Từ đa âm tiết (Từ dài)",
        details: "Từ 'San Francisco' có vẻ hơi dài và khiến bé bị ngập ngừng. Hãy dạy bé tách ra thành: San - Fran - cis - co.",
        exampleWords: ["San Francisco"]
      },
      {
        category: "Âm 'th' /θ/",
        details: "Trong các từ như 'nothing' hay 'month', bé phát âm âm 'th' còn gần giống với tiếng Việt.",
        exampleWords: ["nothing", "month"]
      }
    ]
  },
  {
    name: "Chị Hai",
    role: "Đóng vai người bố",
    avatar: "🎒",
    pros: [
      "Đọc rất bình tĩnh, điềm tĩnh.",
      "Phát âm các từ đơn lẻ khá chuẩn.",
      "Phát âm rõ chữ, dễ nghe."
    ],
    improvements: [
      {
        category: "Trọng âm & Ngữ điệu",
        details: "Bé đọc hơi đều giọng (monotone), giống như đang đọc chữ hơn là giao tiếp thực tế.",
        exampleWords: ["Cần thêm cảm xúc trầm ấm của người bố"]
      },
      {
        category: "Từ chưa chính xác",
        details: "Từ 'matter' (trong câu 'What's the matter?'), bé nghe hơi giống 'ma-thơ'. Từ 'interesting' đọc đủ các âm nhưng chưa đúng trọng âm (phải nhấn vào âm tiết đầu tiên).",
        exampleWords: ["matter", "interesting"]
      }
    ]
  }
];

export const VOCABULARY_LIST: Vocabulary[] = [
  {
    word: "Tired",
    partOfSpeech: "Adj",
    ipa: "/taɪərd/",
    meaning: "Mệt mỏi, kiệt sức.",
    example: "A little tired (Hơi mệt một chút)."
  },
  {
    word: "Matter",
    partOfSpeech: "Noun",
    ipa: "/ˈmæt.ər/",
    meaning: "Vấn đề, việc gì đó xảy ra.",
    example: "What's the matter? (Có chuyện gì thế? / Có vấn đề gì vậy?)"
  },
  {
    word: "Interesting",
    partOfSpeech: "Adj",
    ipa: "/ˈin.trə.stiŋ/",
    meaning: "Thú vị, hay ho, làm cho mình chú ý.",
    example: "That's interesting (Điều đó thật thú vị)."
  },
  {
    word: "Invite",
    partOfSpeech: "Verb",
    ipa: "/ɪnˈvaɪt/",
    meaning: "Mời ai đó đi đâu, làm gì, hoặc dùng bữa.",
    example: "Invite him to dinner (Mời anh ấy dùng bữa tối)."
  }
];

export const SUGGESTIONS = [
  {
    word: "Thanks",
    ipa: "/θæŋks/",
    tip: "Chú ý bật âm /s/ nhẹ nhàng ở cuối."
  },
  {
    word: "Matter",
    ipa: "/ˈmæt.ər/",
    tip: "Âm 't' ở giữa, giọng Anh-Mỹ thường đọc lướt nhẹ gần như chữ 'đ' -> ma-đờ."
  },
  {
    word: "Interesting",
    ipa: "/ˈɪn.trə.stɪŋ/",
    tip: "Thay vì đọc 4 âm 'in-te-res-ting', đọc gọn thành 3 âm tiết: 'In-tres-ting' (nhấn trọng âm đầu)."
  },
  {
    word: "San Francisco",
    ipa: "/ˌsæn frənˈsɪs.koʊ/",
    tip: "Đọc chậm, rõ ràng từng âm rồi nối lại: San-Fran-cis-co."
  }
];

export const METHOD_TIPS = [
  {
    title: "Trò chơi 'Mật mã' Âm Đuôi",
    description: "Nhắc các bé rằng tiếng Anh giống như có các 'mật mã' ở cuối từ (như /s/, /t/, /d/). Hãy thử cùng bé chơi trò chơi thi xem ai bật hơi âm đuôi rõ và 'tây' hơn để rèn luyện thói quen không bỏ quên ending sounds.",
    icon: "🎮"
  },
  {
    title: "Shadowing (Nhại giọng)",
    description: "Hãy cho 2 bé nghe đoạn hội thoại gốc của người bản xứ, dừng sau mỗi câu để hai bé nhại lại y hệt ngữ điệu, nhấn nhá cảm xúc và cách nối âm tự nhiên của họ.",
    icon: "🗣️"
  },
  {
    title: "Đổi Vai & Diễn Xuất",
    description: "Thử cho hai bé đổi vai cho nhau. Khuyến khích các bé 'diễn' cảm xúc hơn: vai bố cần âm thanh trầm ấm, quan tâm; vai Kate khi nói 'a little tired' có thể tỏ ra giọng điệu hơi uể oải một chút.",
    icon: "🎭"
  }
];

export const VOICE_OPTIONS: VoiceOption[] = [
  {
    value: "Kore",
    label: "Kore (Giọng nữ ấm áp)",
    description: "Giọng nữ truyền thống, phát âm nhẹ mượt, tốc độ vừa phải, lý tưởng cho việc sửa lỗi trực quan.",
    gender: "female"
  },
  {
    value: "Puck",
    label: "Puck (Giọng nam vui nhộn)",
    description: "Giọng nam hoạt bát, vui vẻ, mang sắc thái năng động.",
    gender: "male"
  },
  {
    value: "Charon",
    label: "Charon (Giọng nam trầm ấm)",
    description: "Giọng nam chững chạc, ổn định, truyền đạt thông điệp rõ ràng.",
    gender: "male"
  },
  {
    value: "Fenrir",
    label: "Fenrir (Giọng nam mạnh mẽ)",
    description: "Giọng nam dày dặn, uy lực và trầm lắng.",
    gender: "male"
  },
  {
    value: "Zephyr",
    label: "Zephyr (Giọng nữ thanh thoát)",
    description: "Giọng nữ mỏng, ấm áp và có tiết tấu tự nhiên.",
    gender: "female"
  }
];

export const MOODS = [
  { value: "naturally", label: "Tự nhiên (Naturally)" },
  { value: "cheerfully", label: "Vui tươi (Cheerfully)" },
  { value: "warmly", label: "Ấm áp (Warmly)" },
  { value: "slowly and clearly", label: "Chậm rãi & Rõ âm (Slowly & Clearly)" },
  { value: "patiently as a mother", label: "Kiên nhẫn dỗ dành (Patiently as a mother)" }
];

/**
 * Little Melody - Lessons Content Data (Decoupled Schema)
 * Contains the complete curriculum for all 6 core preschool topics.
 */

window.LESSONS_DATA = [
  {
    id: 'color-party',
    title: 'Rainbow Colors',
    subtitle: 'Bữa tiệc sắc màu',
    icon: '🎈',
    themeColor: '#FF6B6B',
    bgColor: '#FFF5F5',
    mascotIntroVi: 'Chào bé yêu! Hôm nay chúng mình cùng đi dự tiệc bóng bay sắc màu rực rỡ với Rồng Con nhé!',
    songLyricsVi: 'Bóng bay lung linh mang sắc màu tươi thắm!',
    songLyricsEn: 'Red and Blue, Yellow and Green! Rainbow colors, so pretty to be seen!',
    vocabulary: [
      {
        word: 'Red',
        meaningVi: 'Màu đỏ',
        colorCode: '#FF4757',
        icon: '🎈',
        sampleItem: 'Quả táo đỏ / Bóng đỏ'
      },
      {
        word: 'Blue',
        meaningVi: 'Màu xanh da trời',
        colorCode: '#1E90FF',
        icon: '🎈',
        sampleItem: 'Bầu trời xanh / Bóng xanh'
      },
      {
        word: 'Yellow',
        meaningVi: 'Màu vàng',
        colorCode: '#FFA502',
        icon: '🎈',
        sampleItem: 'Ánh mặt trời / Bóng vàng'
      },
      {
        word: 'Green',
        meaningVi: 'Màu xanh lá',
        colorCode: '#2ED573',
        icon: '🎈',
        sampleItem: 'Chiếc lá xanh / Bóng lục'
      }
    ],
    movementPromptVi: 'Giờ cùng Rồng Con dang đôi cánh bay như cánh chim trên bầu trời nào! Nhún nhảy 1, 2, 3 và bay nào!',
    movementAction: 'fly-wings',
    reviewEncouragementVi: 'Bé nhớ tên các sắc màu siêu quá! Hoan hô bé đã hoàn thành Bữa tiệc sắc màu!'
  },
  {
    id: 'hello-world',
    title: 'Hello World',
    subtitle: 'Chào bạn mới',
    icon: '👋',
    themeColor: '#48DBFB',
    bgColor: '#F0F9FF',
    mascotIntroVi: 'Hôm nay chúng mình cùng Rồng Con học cách vẫy tay chào và cảm ơn các bạn động vật đáng yêu nhé!',
    songLyricsVi: 'Gặp bạn thì ta mỉm cười nói Hello!',
    songLyricsEn: 'Hello, Hello! How are you? Bye-bye, Thank you, see you soon!',
    vocabulary: [
      {
        word: 'Hello',
        meaningVi: 'Xin chào',
        colorCode: '#FF6B81',
        icon: '👋',
        sampleItem: 'Vẫy tay chào bạn'
      },
      {
        word: 'Bye-bye',
        meaningVi: 'Tạm biệt',
        colorCode: '#70A1FF',
        icon: '🤝',
        sampleItem: 'Vẫy tay tạm biệt'
      },
      {
        word: 'Thank you',
        meaningVi: 'Cảm ơn',
        colorCode: '#7BED9F',
        icon: '💖',
        sampleItem: 'Đặt tay lên ngực cảm ơn'
      }
    ],
    movementPromptVi: 'Bé đứng dậy vẫy hai tay thật cao và nghiêng người sang trái, sang phải chào mọi người nào!',
    movementAction: 'wave-hands',
    reviewEncouragementVi: 'Bé ngoan và lịch sự quá! Giờ bé đã biết chào Hello và nói Thank you rồi đấy!'
  },
  {
    id: 'animal-dance',
    title: 'Animal Dance',
    subtitle: 'Vũ điệu muôn loài',
    icon: '🐱',
    themeColor: '#FFA502',
    bgColor: '#FFFBF0',
    mascotIntroVi: 'Lắng nghe xem bạn động vật nào đang trốn sau bụi cây và cùng Rồng Con nhảy múa nào!',
    songLyricsVi: 'Mèo kêu Meow meow, Cún sủa Gâu gâu vui tươi!',
    songLyricsEn: 'Cat and Dog, Duck and Cow! Dance together, right here, right now!',
    vocabulary: [
      {
        word: 'Cat',
        meaningVi: 'Con mèo',
        colorCode: '#FFA502',
        icon: '🐱',
        soundFx: 'Meow'
      },
      {
        word: 'Dog',
        meaningVi: 'Con chó',
        colorCode: '#A4B0BE',
        icon: '🐶',
        soundFx: 'Woof'
      },
      {
        word: 'Duck',
        meaningVi: 'Con vịt',
        colorCode: '#FFEAA7',
        icon: '🦆',
        soundFx: 'Quack'
      },
      {
        word: 'Cow',
        meaningVi: 'Con bò sữa',
        colorCode: '#57606F',
        icon: '🐮',
        soundFx: 'Moo'
      }
    ],
    movementPromptVi: 'Cùng giơ 2 tay lên đầu làm tai mèo lắc lư, và kêu "Meow meow" thật dễ thương nào bé ơi!',
    movementAction: 'cat-ears',
    reviewEncouragementVi: 'Bé bắt chước các bạn động vật giỏi ơi là giỏi! Hoan hô bé yêu!'
  },
  {
    id: 'yummy-fruits',
    title: 'Yummy Fruits',
    subtitle: 'Trái cây ngon lành',
    icon: '🍎',
    themeColor: '#2ED573',
    bgColor: '#F0FFF4',
    mascotIntroVi: 'Vườn cây của Rồng Con sai trĩu quả rồi! Chúng mình cùng hái trái cây ngọt lành bỏ vào giỏ nhé!',
    songLyricsVi: 'Táo giòn thơm mát, Chuối ngọt ngào ngon lành!',
    songLyricsEn: 'Apple, Banana, Orange so sweet! Yummy yummy fruit, a healthy treat!',
    vocabulary: [
      {
        word: 'Apple',
        meaningVi: 'Quả táo đỏ',
        colorCode: '#FF4757',
        icon: '🍎',
        sampleItem: 'Táo đỏ ngọt lịm'
      },
      {
        word: 'Banana',
        meaningVi: 'Quả chuối vàng',
        colorCode: '#ECCC68',
        icon: '🍌',
        sampleItem: 'Chuối vàng cong cong'
      },
      {
        word: 'Orange',
        meaningVi: 'Quả cam mọng',
        colorCode: '#FF7F50',
        icon: '🍊',
        sampleItem: 'Cam tròn thơm lừng'
      }
    ],
    movementPromptVi: 'Bé kiễng chân lên thật cao, với hai tay lên hái quả trên cành rồi bỏ vào giỏ nào: 1, 2, 3!',
    movementAction: 'pick-fruit',
    reviewEncouragementVi: 'Giỏ quả đầy ắp rồi! Bé đã nhận biết được các loại trái cây Apple, Banana và Orange siêu tài tình!'
  },
  {
    id: 'count-jump',
    title: 'Count & Jump',
    subtitle: 'Đếm sao cùng nhảy',
    icon: '⭐',
    themeColor: '#A55EEA',
    bgColor: '#F9F0FF',
    mascotIntroVi: 'Những ngôi sao âm nhạc lấp lánh đang gọi bé kìa! Cùng đếm từ One đến Five và nhảy thật cao nhé!',
    songLyricsVi: 'Một, hai, ba, bốn, năm ngôi sao sáng ngời!',
    songLyricsEn: 'One, Two, Three, Four, Five! Jump so high, reach the sky!',
    vocabulary: [
      { word: 'One', meaningVi: 'Số một', colorCode: '#FF6B6B', icon: '1️⃣' },
      { word: 'Two', meaningVi: 'Số hai', colorCode: '#FFA502', icon: '2️⃣' },
      { word: 'Three', meaningVi: 'Số ba', colorCode: '#2ED573', icon: '3️⃣' },
      { word: 'Four', meaningVi: 'Số bốn', colorCode: '#1E90FF', icon: '4️⃣' },
      { word: 'Five', meaningVi: 'Số năm', colorCode: '#9B59B6', icon: '5️⃣' }
    ],
    movementPromptVi: 'Cùng nhún chân và nhảy lên theo nhịp đếm: 1... 2... 3... 4... 5! Nhảy thật cao nào bé ơi!',
    movementAction: 'jump-count',
    reviewEncouragementVi: 'Bé đếm số và nhảy siêu khỏe! Ngôi sao vàng tặng cho bé yêu này!'
  },
  {
    id: 'move-body',
    title: 'Move Your Body',
    subtitle: 'Cùng bé vận động',
    icon: '💃',
    themeColor: '#FF78C4',
    bgColor: '#FFF0F7',
    mascotIntroVi: 'Đã đến giờ vận động cơ thể rồi! Rồng Con nói động tác nào, bé làm theo thật chuẩn nhé!',
    songLyricsVi: 'Vỗ tay thật to, rồi đứng im phăng phắc!',
    songLyricsEn: 'Clap your hands! Jump and dance! When I say STOP, freeze in place!',
    vocabulary: [
      { word: 'Clap', meaningVi: 'Vỗ tay', colorCode: '#FF6B81', icon: '👏' },
      { word: 'Jump', meaningVi: 'Nhảy lên', colorCode: '#2ED573', icon: '🦘' },
      { word: 'Dance', meaningVi: 'Nhảy múa', colorCode: '#FFA502', icon: '💃' },
      { word: 'Stop', meaningVi: 'Đứng im', colorCode: '#FF4757', icon: '🛑' }
    ],
    movementPromptVi: 'Rồng Con hô: Clap! Bé vỗ tay bốp bốp! Rồng Con hô: Stop! Bé đứng im như pho tượng nhé!',
    movementAction: 'freeze-dance',
    reviewEncouragementVi: 'Bé phản xạ vận động quá tuyệt vời! Cơ thể khỏe mạnh và trí não thông minh!'
  }
];

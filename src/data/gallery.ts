export type LocaleText = Record<'zh' | 'en', string>;

export interface Work {
  slug: string;
  year: number;
  coverImage: string;
  previewImage: string;
  thumbnail: string;
  title: LocaleText;
  location: LocaleText;
  description: LocaleText;
  shootingDate: string;
  camera: string;
  lens: string;
  aperture: string;
  shutter: string;
  iso: string;
}

export const works: Work[] = [
  {
    slug: 'aurora-meadow',
    year: 2024,
    coverImage: '/images/gallery/work-01.jpg',
    previewImage: '/images/previews/work-01.jpg',
    thumbnail: '/images/thumbs/work-01.jpg',
    title: { zh: '极光草甸', en: 'Aurora Meadow' },
    location: { zh: '冰岛东部', en: 'Eastern Iceland' },
    description: {
      zh: '晨雾还未散尽，草甸在初升太阳的映照下泛着银蓝色的光，像极光落在大地上。',
      en: 'Mist lingers over the meadow while the first sunlight paints the grass in silver-blue, as if the aurora had descended.'
    },
    shootingDate: '2024-04-15',
    camera: 'Leica M10-P',
    lens: 'Summicron-M 35mm f/2',
    aperture: 'f/5.6',
    shutter: '1/125s',
    iso: '200'
  },
  {
    slug: 'crimson-dunes',
    year: 2023,
    coverImage: '/images/gallery/work-02.jpg',
    previewImage: '/images/previews/work-02.jpg',
    thumbnail: '/images/thumbs/work-02.jpg',
    title: { zh: '赤色沙丘', en: 'Crimson Dunes' },
    location: { zh: '纳米布沙漠', en: 'Namib Desert' },
    description: {
      zh: '日落前最后一缕光照亮沙丘的脊线，骆驼刺的影子拉出长长的孤独。',
      en: 'The last flare of sunset traces the dune ridge while camelthorn shadows stretch across the sand.'
    },
    shootingDate: '2023-09-02',
    camera: 'Hasselblad X2D 100C',
    lens: 'XCD 45mm f/3.5',
    aperture: 'f/8',
    shutter: '1/60s',
    iso: '100'
  },
  {
    slug: 'golden-hour',
    year: 2022,
    coverImage: '/images/gallery/work-03.jpg',
    previewImage: '/images/previews/work-03.jpg',
    thumbnail: '/images/thumbs/work-03.jpg',
    title: { zh: '金色时刻', en: 'Golden Hour' },
    location: { zh: '托斯卡纳丘陵', en: 'Tuscan Hills' },
    description: {
      zh: '夕阳绕过橄榄树林，温暖的光线将山谷的纹理刻画得柔和细腻。',
      en: 'The sun slips past olive groves, carving delicate textures across the warm valley.'
    },
    shootingDate: '2022-05-21',
    camera: 'Fujifilm GFX 100S',
    lens: 'GF 80mm f/1.7',
    aperture: 'f/4',
    shutter: '1/160s',
    iso: '160'
  },
  {
    slug: 'nocturne',
    year: 2021,
    coverImage: '/images/gallery/work-04.jpg',
    previewImage: '/images/previews/work-04.jpg',
    thumbnail: '/images/thumbs/work-04.jpg',
    title: { zh: '夜曲', en: 'Nocturne' },
    location: { zh: '东京湾', en: 'Tokyo Bay' },
    description: {
      zh: '海面被城市灯光染成深蓝，长曝光中的船只仿佛无声的音符。',
      en: 'City lights tint the bay deep blue while long exposures turn the ferries into silent notes.'
    },
    shootingDate: '2021-11-12',
    camera: 'Sony A7R V',
    lens: 'FE 24-70mm f/2.8 GM',
    aperture: 'f/11',
    shutter: '30s',
    iso: '64'
  },
  {
    slug: 'verdant-steps',
    year: 2020,
    coverImage: '/images/gallery/work-05.jpg',
    previewImage: '/images/previews/work-05.jpg',
    thumbnail: '/images/thumbs/work-05.jpg',
    title: { zh: '翠绿梯田', en: 'Verdant Steps' },
    location: { zh: '元阳梯田', en: 'Yuanyang Terraces' },
    description: {
      zh: '雨后初晴的山谷里，梯田被薄雾缭绕，倒映着天空的青绿。',
      en: 'Fresh after the rain, terraces embrace the valley with mist and mirror the teal sky.'
    },
    shootingDate: '2020-07-08',
    camera: 'Phase One IQ4',
    lens: 'Schneider 55mm f/2.8',
    aperture: 'f/11',
    shutter: '1/30s',
    iso: '50'
  },
  {
    slug: 'misty-ridge',
    year: 2019,
    coverImage: '/images/gallery/work-06.jpg',
    previewImage: '/images/previews/work-06.jpg',
    thumbnail: '/images/thumbs/work-06.jpg',
    title: { zh: '雾色山脊', en: 'Misty Ridge' },
    location: { zh: '阿尔卑斯山', en: 'The Alps' },
    description: {
      zh: '山脊在云海之间若隐若现，雪线以上的岩石镀上了一层蓝灰色的霜。',
      en: 'Ridges fade between the clouds while frost paints the rocks in bluish gray above the snow line.'
    },
    shootingDate: '2019-02-19',
    camera: 'Nikon D850',
    lens: 'AF-S 70-200mm f/2.8E',
    aperture: 'f/6.3',
    shutter: '1/250s',
    iso: '200'
  },
  {
    slug: 'urban-pulse',
    year: 2018,
    coverImage: '/images/gallery/work-07.jpg',
    previewImage: '/images/previews/work-07.jpg',
    thumbnail: '/images/thumbs/work-07.jpg',
    title: { zh: '城市脉搏', en: 'Urban Pulse' },
    location: { zh: '纽约曼哈顿', en: 'Manhattan, New York' },
    description: {
      zh: '雨夜的霓虹折射在街道上，斑驳光影像节拍一样律动。',
      en: 'Neon reflections ripple across the rainy street, pulsing like a metronome.'
    },
    shootingDate: '2018-10-03',
    camera: 'Leica Q2',
    lens: 'Summilux 28mm f/1.7',
    aperture: 'f/1.7',
    shutter: '1/60s',
    iso: '800'
  },
  {
    slug: 'silent-lake',
    year: 2017,
    coverImage: '/images/gallery/work-08.jpg',
    previewImage: '/images/previews/work-08.jpg',
    thumbnail: '/images/thumbs/work-08.jpg',
    title: { zh: '寂静湖面', en: 'Silent Lake' },
    location: { zh: '加拿大班夫', en: 'Banff, Canada' },
    description: {
      zh: '薄雾漂浮在湖面上，唯一的声音来自远处偶尔传来的雁鸣。',
      en: 'A thin veil of mist drifts over the lake; only distant geese break the silence.'
    },
    shootingDate: '2017-06-17',
    camera: 'Canon EOS 5DS R',
    lens: 'EF 24-70mm f/2.8L II',
    aperture: 'f/9',
    shutter: '1/125s',
    iso: '100'
  }
];

export const years = Array.from(new Set(works.map((work) => work.year))).sort((a, b) => b - a);

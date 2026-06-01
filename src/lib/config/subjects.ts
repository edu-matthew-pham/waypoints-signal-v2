export interface TopicConfig {
  key: string;
  label: string;
}

export interface SubjectConfig {
  id: string;
  label: string;
  dataFile: string;
  nodeFiles: string[];
  authoredYears: string[];
  topics?: Record<string, TopicConfig[]>;
}

export const SUBJECTS: SubjectConfig[] = [
  {
    id: 'science',
    label: 'Science',
    dataFile: 'science/science_progression_map.json',
    nodeFiles: [
      // Foundation
      'science/yf_science_AC9SFU01.json', 'science/yf_science_AC9SFU02.json', 'science/yf_science_AC9SFU03.json',
      'science/yf_science_AC9SFH01.json',
      'science/yf_science_AC9SFI01.json', 'science/yf_science_AC9SFI02.json', 'science/yf_science_AC9SFI03.json',
      'science/yf_science_AC9SFI04.json', 'science/yf_science_AC9SFI05.json',
      // Y1
      'science/y1_science_AC9S1U01.json', 'science/y1_science_AC9S1U02.json', 'science/y1_science_AC9S1U03.json',
      'science/y1_science_AC9S1H01.json',
      'science/y1_science_AC9S1I01.json', 'science/y1_science_AC9S1I02.json', 'science/y1_science_AC9S1I03.json',
      'science/y1_science_AC9S1I04.json', 'science/y1_science_AC9S1I05.json', 'science/y1_science_AC9S1I06.json',
      // Y2
      'science/y2_science_AC9S2U01.json', 'science/y2_science_AC9S2U02.json', 'science/y2_science_AC9S2U03.json',
      // Y3
      'science/y3_science_AC9S3U01.json', 'science/y3_science_AC9S3U02.json',
      'science/y3_science_AC9S3U03.json', 'science/y3_science_AC9S3U04.json',
      'science/y3_science_AC9S3H01.json', 'science/y3_science_AC9S3H02.json',
      'science/y3_science_AC9S3I01.json', 'science/y3_science_AC9S3I02.json', 'science/y3_science_AC9S3I03.json',
      'science/y3_science_AC9S3I04.json', 'science/y3_science_AC9S3I05.json', 'science/y3_science_AC9S3I06.json',
      // Y4
      'science/y4_science_AC9S4U01.json', 'science/y4_science_AC9S4U02.json',
      'science/y4_science_AC9S4U03.json', 'science/y4_science_AC9S4U04.json',
      // Y5
      'science/y5_science_AC9S5U01.json', 'science/y5_science_AC9S5U02.json',
      'science/y5_science_AC9S5U03.json', 'science/y5_science_AC9S5U04.json',
      'science/y5_science_AC9S5H01.json', 'science/y5_science_AC9S5H02.json',
      'science/y5_science_AC9S5I01.json', 'science/y5_science_AC9S5I02.json', 'science/y5_science_AC9S5I03.json',
      'science/y5_science_AC9S5I04.json', 'science/y5_science_AC9S5I05.json', 'science/y5_science_AC9S5I06.json',
      // Y6
      'science/y6_science_AC9S6U01.json', 'science/y6_science_AC9S6U02.json',
      'science/y6_science_AC9S6U03.json', 'science/y6_science_AC9S6U04.json',
      // Y7
      'science/y7_science_AC9S7U01.json', 'science/y7_science_AC9S7U02.json', 'science/y7_science_AC9S7U03.json',
      'science/y7_science_AC9S7U04.json', 'science/y7_science_AC9S7U05.json', 'science/y7_science_AC9S7U06.json',
      'science/y7_science_AC9S7H01.json', 'science/y7_science_AC9S7H02.json',
      'science/y7_science_AC9S7H03.json', 'science/y7_science_AC9S7H04.json',
      'science/y7_science_AC9S7I01.json', 'science/y7_science_AC9S7I02.json', 'science/y7_science_AC9S7I03.json',
      'science/y7_science_AC9S7I04.json', 'science/y7_science_AC9S7I05.json', 'science/y7_science_AC9S7I06.json',
      'science/y7_science_AC9S7I07.json', 'science/y7_science_AC9S7I08.json',
      // Y8
      'science/y8_science_AC9S8U01.json', 'science/y8_science_AC9S8U02.json', 'science/y8_science_AC9S8U03.json',
      'science/y8_science_AC9S8U04.json', 'science/y8_science_AC9S8U05.json',
      'science/y8_science_AC9S8U06.json', 'science/y8_science_AC9S8U07.json',
      // Y9
      'science/y9_science_AC9S9U01.json', 'science/y9_science_AC9S9U02.json', 'science/y9_science_AC9S9U03.json',
      'science/y9_science_AC9S9U04.json', 'science/y9_science_AC9S9U05.json',
      'science/y9_science_AC9S9U06.json', 'science/y9_science_AC9S9U07.json',
      'science/y9_science_AC9S9H01.json', 'science/y9_science_AC9S9H02.json',
      'science/y9_science_AC9S9H03.json', 'science/y9_science_AC9S9H04.json',
      'science/y9_science_AC9S9I01.json', 'science/y9_science_AC9S9I02.json', 'science/y9_science_AC9S9I03.json',
      'science/y9_science_AC9S9I04.json', 'science/y9_science_AC9S9I05.json', 'science/y9_science_AC9S9I06.json',
      'science/y9_science_AC9S9I07.json', 'science/y9_science_AC9S9I08.json',
      // Y10
      'science/y10_science_AC9S10U01.json', 'science/y10_science_AC9S10U02.json', 'science/y10_science_AC9S10U03.json',
      'science/y10_science_AC9S10U04.json', 'science/y10_science_AC9S10U05.json',
      'science/y10_science_AC9S10U06.json', 'science/y10_science_AC9S10U07.json',
    ],
    authoredYears: ['F', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
  },
  {
    id: 'maths',
    label: 'Mathematics',
    dataFile: 'maths/maths_progression_map.json',
    nodeFiles: [
      // Foundation
      'maths/yf_maths_AC9MFA01.json', 'maths/yf_maths_AC9MFM01.json', 'maths/yf_maths_AC9MFM02.json',
      'maths/yf_maths_AC9MFN01.json', 'maths/yf_maths_AC9MFN02.json', 'maths/yf_maths_AC9MFN03.json',
      'maths/yf_maths_AC9MFN04.json', 'maths/yf_maths_AC9MFN05.json', 'maths/yf_maths_AC9MFN06.json',
      'maths/yf_maths_AC9MFSP01.json', 'maths/yf_maths_AC9MFSP02.json', 'maths/yf_maths_AC9MFST01.json',
      // Y1
      'maths/y1_maths_AC9M1N01.json', 'maths/y1_maths_AC9M1N02.json', 'maths/y1_maths_AC9M1N03.json',
      'maths/y1_maths_AC9M1N04.json', 'maths/y1_maths_AC9M1N05.json', 'maths/y1_maths_AC9M1N06.json',
      'maths/y1_maths_AC9M1A01.json', 'maths/y1_maths_AC9M1A02.json',
      'maths/y1_maths_AC9M1M01.json', 'maths/y1_maths_AC9M1M02.json', 'maths/y1_maths_AC9M1M03.json',
      'maths/y1_maths_AC9M1SP01.json', 'maths/y1_maths_AC9M1SP02.json',
      'maths/y1_maths_AC9M1ST01.json', 'maths/y1_maths_AC9M1ST02.json',
      // Y2
      'maths/y2_maths_AC9M2A01.json', 'maths/y2_maths_AC9M2A02.json', 'maths/y2_maths_AC9M2A03.json',
      'maths/y2_maths_AC9M2M01.json', 'maths/y2_maths_AC9M2M02.json', 'maths/y2_maths_AC9M2M03.json',
      'maths/y2_maths_AC9M2M04.json', 'maths/y2_maths_AC9M2M05.json',
      'maths/y2_maths_AC9M2N01.json', 'maths/y2_maths_AC9M2N02.json', 'maths/y2_maths_AC9M2N03.json',
      'maths/y2_maths_AC9M2N04.json', 'maths/y2_maths_AC9M2N05.json', 'maths/y2_maths_AC9M2N06.json',
      'maths/y2_maths_AC9M2SP01.json', 'maths/y2_maths_AC9M2SP02.json',
      'maths/y2_maths_AC9M2ST01.json', 'maths/y2_maths_AC9M2ST02.json',
      // Y3
      'maths/y3_maths_AC9M3A01.json', 'maths/y3_maths_AC9M3A02.json', 'maths/y3_maths_AC9M3A03.json',
      'maths/y3_maths_AC9M3M01.json', 'maths/y3_maths_AC9M3M02.json', 'maths/y3_maths_AC9M3M03.json',
      'maths/y3_maths_AC9M3M04.json', 'maths/y3_maths_AC9M3M05.json', 'maths/y3_maths_AC9M3M06.json',
      'maths/y3_maths_AC9M3N01.json', 'maths/y3_maths_AC9M3N02.json', 'maths/y3_maths_AC9M3N03.json',
      'maths/y3_maths_AC9M3N04.json', 'maths/y3_maths_AC9M3N05.json', 'maths/y3_maths_AC9M3N06.json',
      'maths/y3_maths_AC9M3N07.json',
      'maths/y3_maths_AC9M3P01.json', 'maths/y3_maths_AC9M3P02.json',
      'maths/y3_maths_AC9M3SP01.json', 'maths/y3_maths_AC9M3SP02.json',
      'maths/y3_maths_AC9M3ST01.json', 'maths/y3_maths_AC9M3ST02.json', 'maths/y3_maths_AC9M3ST03.json',
      // Y4
      'maths/y4_maths_AC9M4A01.json', 'maths/y4_maths_AC9M4A02.json',
      'maths/y4_maths_AC9M4N01.json', 'maths/y4_maths_AC9M4N02.json', 'maths/y4_maths_AC9M4N03.json',
      'maths/y4_maths_AC9M4N04.json', 'maths/y4_maths_AC9M4N05.json', 'maths/y4_maths_AC9M4N06.json',
      'maths/y4_maths_AC9M4N07.json', 'maths/y4_maths_AC9M4N08.json', 'maths/y4_maths_AC9M4N09.json',
      'maths/y4_maths_AC9M4M01.json', 'maths/y4_maths_AC9M4M02.json', 'maths/y4_maths_AC9M4M03.json',
      'maths/y4_maths_AC9M4M04.json',
      'maths/y4_maths_AC9M4SP01.json', 'maths/y4_maths_AC9M4SP02.json', 'maths/y4_maths_AC9M4SP03.json',
      'maths/y4_maths_AC9M4ST01.json', 'maths/y4_maths_AC9M4ST02.json', 'maths/y4_maths_AC9M4ST03.json',
      'maths/y4_maths_AC9M4P01.json', 'maths/y4_maths_AC9M4P02.json',
      // Y5
      'maths/y5_maths_AC9M5A01.json', 'maths/y5_maths_AC9M5A02.json',
      'maths/y5_maths_AC9M5M01.json', 'maths/y5_maths_AC9M5M02.json', 'maths/y5_maths_AC9M5M03.json',
      'maths/y5_maths_AC9M5M04.json',
      'maths/y5_maths_AC9M5N01.json', 'maths/y5_maths_AC9M5N02.json', 'maths/y5_maths_AC9M5N03.json',
      'maths/y5_maths_AC9M5N04.json', 'maths/y5_maths_AC9M5N05.json', 'maths/y5_maths_AC9M5N06.json',
      'maths/y5_maths_AC9M5N07.json', 'maths/y5_maths_AC9M5N08.json', 'maths/y5_maths_AC9M5N09.json',
      'maths/y5_maths_AC9M5N10.json',
      'maths/y5_maths_AC9M5P01.json', 'maths/y5_maths_AC9M5P02.json',
      'maths/y5_maths_AC9M5SP01.json', 'maths/y5_maths_AC9M5SP02.json', 'maths/y5_maths_AC9M5SP03.json',
      'maths/y5_maths_AC9M5ST01.json', 'maths/y5_maths_AC9M5ST02.json', 'maths/y5_maths_AC9M5ST03.json',
      // Y6
      'maths/y6_maths_ac9m6n01.json', 'maths/y6_maths_ac9m6n02.json', 'maths/y6_maths_ac9m6n03.json',
      'maths/y6_maths_ac9m6n04.json', 'maths/y6_maths_ac9m6n05.json', 'maths/y6_maths_ac9m6n06.json',
      'maths/y6_maths_ac9m6n07.json', 'maths/y6_maths_ac9m6n08.json', 'maths/y6_maths_ac9m6n09.json',
      'maths/y6_maths_ac9m6a01.json', 'maths/y6_maths_ac9m6a02.json', 'maths/y6_maths_ac9m6a03.json',
      'maths/y6_maths_ac9m6m01.json', 'maths/y6_maths_ac9m6m02.json', 'maths/y6_maths_ac9m6m03.json',
      'maths/y6_maths_ac9m6m04.json',
      'maths/y6_maths_ac9m6sp01.json', 'maths/y6_maths_ac9m6sp02.json', 'maths/y6_maths_ac9m6sp03.json',
      'maths/y6_maths_ac9m6st01.json', 'maths/y6_maths_ac9m6st02.json', 'maths/y6_maths_ac9m6st03.json',
      'maths/y6_maths_ac9m6p01.json', 'maths/y6_maths_ac9m6p02.json',
      // Y7
      'maths/y7_mathematics_AC9M7N01.json', 'maths/y7_mathematics_AC9M7N02.json', 'maths/y7_mathematics_AC9M7N03.json',
      'maths/y7_mathematics_AC9M7N04.json', 'maths/y7_mathematics_AC9M7N05.json', 'maths/y7_mathematics_AC9M7N06.json',
      'maths/y7_mathematics_AC9M7N07.json', 'maths/y7_mathematics_AC9M7N08.json', 'maths/y7_mathematics_AC9M7N09.json',
      'maths/y7_mathematics_AC9M7A01.json', 'maths/y7_mathematics_AC9M7A02.json', 'maths/y7_mathematics_AC9M7A03.json',
      'maths/y7_mathematics_AC9M7A04.json', 'maths/y7_mathematics_AC9M7A05.json', 'maths/y7_mathematics_AC9M7A06.json',
      'maths/y7_mathematics_AC9M7M01.json', 'maths/y7_mathematics_AC9M7M02.json', 'maths/y7_mathematics_AC9M7M03.json',
      'maths/y7_mathematics_AC9M7M04.json', 'maths/y7_mathematics_AC9M7M05.json', 'maths/y7_mathematics_AC9M7M06.json',
      'maths/y7_mathematics_AC9M7SP01.json', 'maths/y7_mathematics_AC9M7SP02.json', 'maths/y7_mathematics_AC9M7SP03.json',
      'maths/y7_mathematics_AC9M7SP04.json',
      'maths/y7_mathematics_AC9M7ST01.json', 'maths/y7_mathematics_AC9M7ST02.json', 'maths/y7_mathematics_AC9M7ST03.json',
      'maths/y7_mathematics_AC9M7P01.json', 'maths/y7_mathematics_AC9M7P02.json',
      // Y8
      'maths/y8_mathematics_AC9M8N01.json', 'maths/y8_mathematics_AC9M8N02.json', 'maths/y8_mathematics_AC9M8N03.json',
      'maths/y8_mathematics_AC9M8N04.json', 'maths/y8_mathematics_AC9M8N05.json',
      'maths/y8_mathematics_AC9M8A01.json', 'maths/y8_mathematics_AC9M8A02.json', 'maths/y8_mathematics_AC9M8A03.json',
      'maths/y8_mathematics_AC9M8A04.json',
      'maths/y8_mathematics_AC9M8M01.json', 'maths/y8_mathematics_AC9M8M02.json', 'maths/y8_mathematics_AC9M8M03.json',
      'maths/y8_mathematics_AC9M8M04.json', 'maths/y8_mathematics_AC9M8M05.json', 'maths/y8_mathematics_AC9M8M06.json',
      'maths/y8_mathematics_AC9M8M07.json',
      'maths/y8_mathematics_AC9M8SP01.json', 'maths/y8_mathematics_AC9M8SP02.json', 'maths/y8_mathematics_AC9M8SP03.json',
      'maths/y8_mathematics_AC9M8SP04.json',
      'maths/y8_mathematics_AC9M8P01.json', 'maths/y8_mathematics_AC9M8P02.json', 'maths/y8_mathematics_AC9M8P03.json',
      'maths/y8_mathematics_AC9M8ST01.json', 'maths/y8_mathematics_AC9M8ST02.json', 'maths/y8_mathematics_AC9M8ST03.json',
      'maths/y8_mathematics_AC9M8ST04.json',
      // Y9
      'maths/y9_maths_AC9M9N01.json',
      'maths/y9_maths_AC9M9A01.json', 'maths/y9_maths_AC9M9A02.json', 'maths/y9_maths_AC9M9A03.json',
      'maths/y9_maths_AC9M9A04.json', 'maths/y9_maths_AC9M9A05.json', 'maths/y9_maths_AC9M9A06.json',
      'maths/y9_maths_AC9M9M01.json', 'maths/y9_maths_AC9M9M02.json', 'maths/y9_maths_AC9M9M03.json',
      'maths/y9_maths_AC9M9M04.json', 'maths/y9_maths_AC9M9M05.json',
      'maths/y9_maths_AC9M9SP01.json', 'maths/y9_maths_AC9M9SP02.json', 'maths/y9_maths_AC9M9SP03.json',
      'maths/y9_maths_AC9M9ST01.json', 'maths/y9_maths_AC9M9ST02.json', 'maths/y9_maths_AC9M9ST03.json',
      'maths/y9_maths_AC9M9ST04.json', 'maths/y9_maths_AC9M9ST05.json',
      'maths/y9_maths_AC9M9P01.json', 'maths/y9_maths_AC9M9P02.json', 'maths/y9_maths_AC9M9P03.json',
      // Y10
      'maths/y10_maths_AC9M10A01.json', 'maths/y10_maths_AC9M10A02.json', 'maths/y10_maths_AC9M10A03.json',
      'maths/y10_maths_AC9M10A04.json', 'maths/y10_maths_AC9M10A05.json',
      'maths/y10_maths_AC9M10M01.json', 'maths/y10_maths_AC9M10M02.json', 'maths/y10_maths_AC9M10M03.json',
      'maths/y10_maths_AC9M10M04.json', 'maths/y10_maths_AC9M10M05.json',
      'maths/y10_maths_AC9M10N01.json',
      'maths/y10_maths_AC9M10P01.json', 'maths/y10_maths_AC9M10P02.json',
      'maths/y10_maths_AC9M10SP01.json', 'maths/y10_maths_AC9M10SP02.json', 'maths/y10_maths_AC9M10SP03.json',
      'maths/y10_maths_AC9M10ST01.json', 'maths/y10_maths_AC9M10ST02.json', 'maths/y10_maths_AC9M10ST03.json',
      'maths/y10_maths_AC9M10ST04.json', 'maths/y10_maths_AC9M10ST05.json',
    ],
    authoredYears: ['F', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
  },
  {
    id: 'english',
    label: 'English',
    dataFile: 'english/english_progression_map.json',
    nodeFiles: [
      // Foundation
      'english/yf_english_AC9EFLA01.json', 'english/yf_english_AC9EFLA02.json', 'english/yf_english_AC9EFLA03.json',
      'english/yf_english_AC9EFLA04.json', 'english/yf_english_AC9EFLA05.json', 'english/yf_english_AC9EFLA06.json',
      'english/yf_english_AC9EFLA07.json', 'english/yf_english_AC9EFLA08.json', 'english/yf_english_AC9EFLA09.json',
      'english/yf_english_AC9EFLY01.json', 'english/yf_english_AC9EFLY09.json', 'english/yf_english_AC9EFLY10.json',
      'english/yf_english_AC9EFLY11.json', 'english/yf_english_AC9EFLY12.json', 'english/yf_english_AC9EFLY13.json',
      'english/yf_english_AC9EFLY14.json', 'english/yf_english_AC9EFLY15.json',
      // Y1
      'english/y1_english_AC9E1LA01.json', 'english/y1_english_AC9E1LA02.json', 'english/y1_english_AC9E1LA03.json',
      'english/y1_english_AC9E1LA04.json', 'english/y1_english_AC9E1LA05.json', 'english/y1_english_AC9E1LA06.json',
      'english/y1_english_AC9E1LA07.json', 'english/y1_english_AC9E1LA08.json', 'english/y1_english_AC9E1LA09.json',
      'english/y1_english_AC9E1LA10.json',
      'english/y1_english_AC9E1LY01.json', 'english/y1_english_AC9E1LY09.json', 'english/y1_english_AC9E1LY10.json',
      'english/y1_english_AC9E1LY11.json', 'english/y1_english_AC9E1LY12.json', 'english/y1_english_AC9E1LY13.json',
      'english/y1_english_AC9E1LY14.json', 'english/y1_english_AC9E1LY15.json',
      // Y2
      'english/y2_english_AC9E2LA01.json', 'english/y2_english_AC9E2LA02.json', 'english/y2_english_AC9E2LA03.json',
      'english/y2_english_AC9E2LA04.json', 'english/y2_english_AC9E2LA05.json', 'english/y2_english_AC9E2LA06.json',
      'english/y2_english_AC9E2LA07.json', 'english/y2_english_AC9E2LA08.json', 'english/y2_english_AC9E2LA09.json',
      'english/y2_english_AC9E2LA10.json',
      'english/y2_english_AC9E2LY01.json', 'english/y2_english_AC9E2LY09.json', 'english/y2_english_AC9E2LY10.json',
      'english/y2_english_AC9E2LY11.json', 'english/y2_english_AC9E2LY12.json',
      // Y3
      'english/y3_english_AC9E3LA01.json', 'english/y3_english_AC9E3LA02.json', 'english/y3_english_AC9E3LA03.json',
      'english/y3_english_AC9E3LA04.json', 'english/y3_english_AC9E3LA05.json', 'english/y3_english_AC9E3LA06.json',
      'english/y3_english_AC9E3LA07.json', 'english/y3_english_AC9E3LA08.json', 'english/y3_english_AC9E3LA09.json',
      'english/y3_english_AC9E3LA10.json', 'english/y3_english_AC9E3LA11.json',
      'english/y3_english_AC9E3LY01.json', 'english/y3_english_AC9E3LY09.json', 'english/y3_english_AC9E3LY10.json',
      'english/y3_english_AC9E3LY11.json', 'english/y3_english_AC9E3LY12.json',
      // Y4
      'english/y4_english_AC9E4LA01.json', 'english/y4_english_AC9E4LA02.json', 'english/y4_english_AC9E4LA03.json',
      'english/y4_english_AC9E4LA04.json', 'english/y4_english_AC9E4LA05.json', 'english/y4_english_AC9E4LA06.json',
      'english/y4_english_AC9E4LA07.json', 'english/y4_english_AC9E4LA08.json', 'english/y4_english_AC9E4LA09.json',
      'english/y4_english_AC9E4LA10.json', 'english/y4_english_AC9E4LA11.json', 'english/y4_english_AC9E4LA12.json',
      'english/y4_english_AC9E4LY01.json', 'english/y4_english_AC9E4LY09.json', 'english/y4_english_AC9E4LY10.json',
      'english/y4_english_AC9E4LY11.json',
      // Y5
      'english/y5_english_AC9E5LA01.json', 'english/y5_english_AC9E5LA02.json', 'english/y5_english_AC9E5LA03.json',
      'english/y5_english_AC9E5LA04.json', 'english/y5_english_AC9E5LA05.json', 'english/y5_english_AC9E5LA06.json',
      'english/y5_english_AC9E5LA07.json', 'english/y5_english_AC9E5LA08.json', 'english/y5_english_AC9E5LA09.json',
      'english/y5_english_AC9E5LY01.json', 'english/y5_english_AC9E5LY08.json', 'english/y5_english_AC9E5LY09.json',
      'english/y5_english_AC9E5LY10.json',
      // Y6
      'english/y6_english_AC9E6LA01.json', 'english/y6_english_AC9E6LA02.json', 'english/y6_english_AC9E6LA03.json',
      'english/y6_english_AC9E6LA04.json', 'english/y6_english_AC9E6LA05.json', 'english/y6_english_AC9E6LA06.json',
      'english/y6_english_AC9E6LA07.json', 'english/y6_english_AC9E6LA08.json', 'english/y6_english_AC9E6LA09.json',
      'english/y6_english_AC9E6LY01.json', 'english/y6_english_AC9E6LY08.json', 'english/y6_english_AC9E6LY09.json',
      // Y7
      'english/y7_english_AC9E7LA01.json', 'english/y7_english_AC9E7LA02.json', 'english/y7_english_AC9E7LA03.json',
      'english/y7_english_AC9E7LA04.json', 'english/y7_english_AC9E7LA05.json', 'english/y7_english_AC9E7LA06.json',
      'english/y7_english_AC9E7LA07.json', 'english/y7_english_AC9E7LA08.json', 'english/y7_english_AC9E7LA09.json',
      'english/y7_english_AC9E7LY01.json', 'english/y7_english_AC9E7LY08.json',
      // Y8
      'english/y8_english_AC9E8LA01.json', 'english/y8_english_AC9E8LA02.json', 'english/y8_english_AC9E8LA03.json',
      'english/y8_english_AC9E8LA04.json', 'english/y8_english_AC9E8LA05.json', 'english/y8_english_AC9E8LA06.json',
      'english/y8_english_AC9E8LA07.json', 'english/y8_english_AC9E8LA08.json', 'english/y8_english_AC9E8LA09.json',
      'english/y8_english_AC9E8LY01.json', 'english/y8_english_AC9E8LY08.json',
      // Y9
      'english/y9_english_AC9E9LA01.json', 'english/y9_english_AC9E9LA02.json', 'english/y9_english_AC9E9LA03.json',
      'english/y9_english_AC9E9LA04.json', 'english/y9_english_AC9E9LA05.json', 'english/y9_english_AC9E9LA06.json',
      'english/y9_english_AC9E9LA07.json', 'english/y9_english_AC9E9LA08.json', 'english/y9_english_AC9E9LA09.json',
      'english/y9_english_AC9E9LY01.json', 'english/y9_english_AC9E9LY08.json',
      // Y10
      'english/y10_english_AC9E10LA01.json', 'english/y10_english_AC9E10LA02.json', 'english/y10_english_AC9E10LA03.json',
      'english/y10_english_AC9E10LA04.json', 'english/y10_english_AC9E10LA05.json', 'english/y10_english_AC9E10LA06.json',
      'english/y10_english_AC9E10LA07.json', 'english/y10_english_AC9E10LA08.json', 'english/y10_english_AC9E10LA09.json',
      'english/y10_english_AC9E10LY01.json', 'english/y10_english_AC9E10LY08.json',
      // Capability
      'english/yf_english_AC9EFLE01.json', 'english/yf_english_AC9EFLE02.json', 'english/yf_english_AC9EFLE03.json',
      'english/yf_english_AC9EFLE04.json', 'english/yf_english_AC9EFLE05.json', 'english/y1_english_AC9E1LE01.json',
      'english/y1_english_AC9E1LE02.json', 'english/y1_english_AC9E1LE03.json', 'english/y1_english_AC9E1LE04.json',
      'english/y1_english_AC9E1LE05.json', 'english/y2_english_AC9E2LE01.json', 'english/y2_english_AC9E2LE02.json',
      'english/y2_english_AC9E2LE03.json', 'english/y2_english_AC9E2LE04.json', 'english/y2_english_AC9E2LE05.json',
      'english/y3_english_AC9E3LE01.json', 'english/y3_english_AC9E3LE02.json', 'english/y3_english_AC9E3LE03.json',
      'english/y3_english_AC9E3LE04.json', 'english/y3_english_AC9E3LE05.json', 'english/y4_english_AC9E4LE01.json',
      'english/y4_english_AC9E4LE02.json', 'english/y4_english_AC9E4LE03.json', 'english/y4_english_AC9E4LE04.json',
      'english/y4_english_AC9E4LE05.json', 'english/y5_english_AC9E5LE01.json', 'english/y5_english_AC9E5LE02.json',
      'english/y5_english_AC9E5LE03.json', 'english/y5_english_AC9E5LE04.json', 'english/y5_english_AC9E5LE05.json',
      'english/y6_english_AC9E6LE01.json', 'english/y6_english_AC9E6LE02.json', 'english/y6_english_AC9E6LE03.json',
      'english/y6_english_AC9E6LE04.json', 'english/y6_english_AC9E6LE05.json', 'english/y7_english_AC9E7LE01.json',
      'english/y7_english_AC9E7LE02.json', 'english/y7_english_AC9E7LE03.json', 'english/y7_english_AC9E7LE04.json',
      'english/y7_english_AC9E7LE05.json', 'english/y7_english_AC9E7LE06.json', 'english/y7_english_AC9E7LE07.json',
      'english/y8_english_AC9E8LE01.json', 'english/y8_english_AC9E8LE02.json', 'english/y8_english_AC9E8LE03.json',
      'english/y8_english_AC9E8LE04.json', 'english/y8_english_AC9E8LE05.json', 'english/y8_english_AC9E8LE06.json',
      'english/y9_english_AC9E9LE01.json', 'english/y9_english_AC9E9LE02.json', 'english/y9_english_AC9E9LE03.json',
      'english/y9_english_AC9E9LE04.json', 'english/y9_english_AC9E9LE05.json', 'english/y9_english_AC9E9LE06.json',
      'english/y10_english_AC9E10LE01.json', 'english/y10_english_AC9E10LE02.json', 'english/y10_english_AC9E10LE03.json',
      'english/y10_english_AC9E10LE04.json', 'english/y10_english_AC9E10LE05.json', 'english/y10_english_AC9E10LE06.json',
      'english/y10_english_AC9E10LE07.json', 'english/y10_english_AC9E10LE08.json',
    ],
    authoredYears: ['F', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
  },
  {
    id: 'hass',
    label: 'HASS (F–6)',
    dataFile: 'hass/hass_progression_map.json',
    nodeFiles: [
      // YF
      'hass/yf_hass_AC9HSFK01.json', 'hass/yf_hass_AC9HSFK02.json',
      'hass/yf_hass_AC9HSFK03.json', 'hass/yf_hass_AC9HSFK04.json',
      // Y1
      'hass/y1_hass_AC9HS1K01.json', 'hass/y1_hass_AC9HS1K02.json',
      'hass/y1_hass_AC9HS1K03.json', 'hass/y1_hass_AC9HS1K04.json',
      // Y2
      'hass/y2_hass_AC9HS2K01.json', 'hass/y2_hass_AC9HS2K02.json',
      'hass/y2_hass_AC9HS2K03.json', 'hass/y2_hass_AC9HS2K04.json',
      // Y3
      'hass/y3_hass_AC9HS3K01.json', 'hass/y3_hass_AC9HS3K02.json', 'hass/y3_hass_AC9HS3K03.json',
      'hass/y3_hass_AC9HS3K04.json', 'hass/y3_hass_AC9HS3K05.json', 'hass/y3_hass_AC9HS3K06.json',
      'hass/y3_hass_AC9HS3K07.json',
      // Y4
      'hass/y4_hass_AC9HS4K01.json', 'hass/y4_hass_AC9HS4K02.json', 'hass/y4_hass_AC9HS4K03.json',
      'hass/y4_hass_AC9HS4K04.json', 'hass/y4_hass_AC9HS4K05.json', 'hass/y4_hass_AC9HS4K06.json',
      'hass/y4_hass_AC9HS4K07.json', 'hass/y4_hass_AC9HS4K08.json', 'hass/y4_hass_AC9HS4K09.json',
      // Y5
      'hass/y5_hass_AC9HS5K01.json', 'hass/y5_hass_AC9HS5K02.json', 'hass/y5_hass_AC9HS5K03.json',
      'hass/y5_hass_AC9HS5K04.json', 'hass/y5_hass_AC9HS5K05.json', 'hass/y5_hass_AC9HS5K06.json',
      'hass/y5_hass_AC9HS5K07.json', 'hass/y5_hass_AC9HS5K08.json',
      // Y6
      'hass/y6_hass_AC9HS6K01.json', 'hass/y6_hass_AC9HS6K02.json', 'hass/y6_hass_AC9HS6K03.json',
      'hass/y6_hass_AC9HS6K04.json', 'hass/y6_hass_AC9HS6K05.json', 'hass/y6_hass_AC9HS6K06.json',
      'hass/y6_hass_AC9HS6K07.json', 'hass/y6_hass_AC9HS6K08.json',
      // Capability
      'hass/yf_hass_AC9HSFS01.json', 'hass/yf_hass_AC9HSFS02.json', 'hass/yf_hass_AC9HSFS03.json',
      'hass/yf_hass_AC9HSFS04.json', 'hass/yf_hass_AC9HSFS05.json', 'hass/y1_hass_AC9HS1S01.json',
      'hass/y1_hass_AC9HS1S02.json', 'hass/y1_hass_AC9HS1S03.json', 'hass/y1_hass_AC9HS1S04.json',
      'hass/y1_hass_AC9HS1S05.json', 'hass/y1_hass_AC9HS1S06.json', 'hass/y2_hass_AC9HS2S01.json',
      'hass/y2_hass_AC9HS2S02.json', 'hass/y2_hass_AC9HS2S03.json', 'hass/y2_hass_AC9HS2S04.json',
      'hass/y2_hass_AC9HS2S05.json', 'hass/y2_hass_AC9HS2S06.json', 'hass/y3_hass_AC9HS3S01.json',
      'hass/y3_hass_AC9HS3S02.json', 'hass/y3_hass_AC9HS3S03.json', 'hass/y3_hass_AC9HS3S04.json',
      'hass/y3_hass_AC9HS3S05.json', 'hass/y3_hass_AC9HS3S06.json', 'hass/y3_hass_AC9HS3S07.json',
      'hass/y4_hass_AC9HS4S01.json', 'hass/y4_hass_AC9HS4S02.json', 'hass/y4_hass_AC9HS4S03.json',
      'hass/y4_hass_AC9HS4S04.json', 'hass/y4_hass_AC9HS4S05.json', 'hass/y4_hass_AC9HS4S06.json',
      'hass/y4_hass_AC9HS4S07.json', 'hass/y5_hass_AC9HS5S01.json', 'hass/y5_hass_AC9HS5S02.json',
      'hass/y5_hass_AC9HS5S03.json', 'hass/y5_hass_AC9HS5S04.json', 'hass/y5_hass_AC9HS5S05.json',
      'hass/y5_hass_AC9HS5S06.json', 'hass/y5_hass_AC9HS5S07.json', 'hass/y6_hass_AC9HS6S01.json',
      'hass/y6_hass_AC9HS6S02.json', 'hass/y6_hass_AC9HS6S03.json', 'hass/y6_hass_AC9HS6S04.json',
      'hass/y6_hass_AC9HS6S05.json', 'hass/y6_hass_AC9HS6S06.json', 'hass/y6_hass_AC9HS6S07.json',
    ],
    authoredYears: ['F', '1', '2', '3', '4', '5', '6'],
  },
  {
    id: 'history',
    label: 'History',
    dataFile: 'hass/hass_progression_map.json',
    nodeFiles: [
      // YF
      'hass/yf_hass_AC9HSFK01.json', 'hass/yf_hass_AC9HSFK02.json',
      // Y1
      'hass/y1_hass_AC9HS1K01.json', 'hass/y1_hass_AC9HS1K02.json',
      // Y2
      'hass/y2_hass_AC9HS2K01.json', 'hass/y2_hass_AC9HS2K02.json',
      // Y3
      'hass/y3_hass_AC9HS3K01.json', 'hass/y3_hass_AC9HS3K02.json',
      // Y4
      'hass/y4_hass_AC9HS4K01.json', 'hass/y4_hass_AC9HS4K02.json',
      'hass/y4_hass_AC9HS4K03.json', 'hass/y4_hass_AC9HS4K04.json',
      // Y5
      'hass/y5_hass_AC9HS5K01.json', 'hass/y5_hass_AC9HS5K02.json', 'hass/y5_hass_AC9HS5K03.json',
      // Y6
      'hass/y6_hass_AC9HS6K01.json', 'hass/y6_hass_AC9HS6K02.json', 'hass/y6_hass_AC9HS6K03.json',
      // Y7
      'history/y7_history_AC9HH7K01.json', 'history/y7_history_AC9HH7K02.json', 'history/y7_history_AC9HH7K03.json',
      'history/y7_history_AC9HH7K04.json', 'history/y7_history_AC9HH7K05.json', 'history/y7_history_AC9HH7K06.json',
      'history/y7_history_AC9HH7K07.json', 'history/y7_history_AC9HH7K08.json', 'history/y7_history_AC9HH7K09.json',
      'history/y7_history_AC9HH7K10.json', 'history/y7_history_AC9HH7K11.json', 'history/y7_history_AC9HH7K12.json',
      'history/y7_history_AC9HH7K13.json',
      // Y8
      'history/y8_history_AC9HH8K01.json', 'history/y8_history_AC9HH8K02.json', 'history/y8_history_AC9HH8K03.json',
      'history/y8_history_AC9HH8K04.json', 'history/y8_history_AC9HH8K05.json', 'history/y8_history_AC9HH8K06.json',
      'history/y8_history_AC9HH8K07.json', 'history/y8_history_AC9HH8K08.json', 'history/y8_history_AC9HH8K09.json',
      'history/y8_history_AC9HH8K10.json', 'history/y8_history_AC9HH8K11.json', 'history/y8_history_AC9HH8K12.json',
      'history/y8_history_AC9HH8K13.json', 'history/y8_history_AC9HH8K14.json', 'history/y8_history_AC9HH8K15.json',
      'history/y8_history_AC9HH8K16.json',
      // Y9
      'history/y9_history_AC9HH9K01.json', 'history/y9_history_AC9HH9K02.json', 'history/y9_history_AC9HH9K03.json',
      'history/y9_history_AC9HH9K04.json', 'history/y9_history_AC9HH9K05.json', 'history/y9_history_AC9HH9K06.json',
      'history/y9_history_AC9HH9K07.json', 'history/y9_history_AC9HH9K08.json', 'history/y9_history_AC9HH9K09.json',
      'history/y9_history_AC9HH9K10.json', 'history/y9_history_AC9HH9K11.json', 'history/y9_history_AC9HH9K12.json',
      'history/y9_history_AC9HH9K13.json', 'history/y9_history_AC9HH9K14.json', 'history/y9_history_AC9HH9K15.json',
      'history/y9_history_AC9HH9K16.json', 'history/y9_history_AC9HH9K17.json', 'history/y9_history_AC9HH9K18.json',
      'history/y9_history_AC9HH9K19.json', 'history/y9_history_AC9HH9K20.json', 'history/y9_history_AC9HH9K21.json',
      'history/y9_history_AC9HH9K22.json', 'history/y9_history_AC9HH9K23.json', 'history/y9_history_AC9HH9K24.json',
      // Y10
      'history/y10_history_AC9HH10K01.json', 'history/y10_history_AC9HH10K02.json', 'history/y10_history_AC9HH10K03.json',
      'history/y10_history_AC9HH10K04.json', 'history/y10_history_AC9HH10K05.json', 'history/y10_history_AC9HH10K06.json',
      'history/y10_history_AC9HH10K07.json', 'history/y10_history_AC9HH10K08.json', 'history/y10_history_AC9HH10K09.json',
      'history/y10_history_AC9HH10K10.json', 'history/y10_history_AC9HH10K11.json', 'history/y10_history_AC9HH10K12.json',
      'history/y10_history_AC9HH10K13.json', 'history/y10_history_AC9HH10K14.json', 'history/y10_history_AC9HH10K15.json',
      'history/y10_history_AC9HH10K16.json', 'history/y10_history_AC9HH10K17.json', 'history/y10_history_AC9HH10K18.json',
      'history/y10_history_AC9HH10K19.json', 'history/y10_history_AC9HH10K20.json',
      // Capability
      'hass/yf_hass_AC9HSFS01.json', 'hass/yf_hass_AC9HSFS02.json', 'hass/yf_hass_AC9HSFS03.json',
      'hass/yf_hass_AC9HSFS04.json', 'hass/yf_hass_AC9HSFS05.json', 'hass/y1_hass_AC9HS1S01.json',
      'hass/y1_hass_AC9HS1S02.json', 'hass/y1_hass_AC9HS1S03.json', 'hass/y1_hass_AC9HS1S04.json',
      'hass/y1_hass_AC9HS1S05.json', 'hass/y1_hass_AC9HS1S06.json', 'hass/y2_hass_AC9HS2S01.json',
      'hass/y2_hass_AC9HS2S02.json', 'hass/y2_hass_AC9HS2S03.json', 'hass/y2_hass_AC9HS2S04.json',
      'hass/y2_hass_AC9HS2S05.json', 'hass/y2_hass_AC9HS2S06.json', 'hass/y3_hass_AC9HS3S01.json',
      'hass/y3_hass_AC9HS3S02.json', 'hass/y3_hass_AC9HS3S03.json', 'hass/y3_hass_AC9HS3S04.json',
      'hass/y3_hass_AC9HS3S05.json', 'hass/y3_hass_AC9HS3S06.json', 'hass/y3_hass_AC9HS3S07.json',
      'hass/y4_hass_AC9HS4S01.json', 'hass/y4_hass_AC9HS4S02.json', 'hass/y4_hass_AC9HS4S03.json',
      'hass/y4_hass_AC9HS4S04.json', 'hass/y4_hass_AC9HS4S05.json', 'hass/y4_hass_AC9HS4S06.json',
      'hass/y4_hass_AC9HS4S07.json', 'hass/y5_hass_AC9HS5S01.json', 'hass/y5_hass_AC9HS5S02.json',
      'hass/y5_hass_AC9HS5S03.json', 'hass/y5_hass_AC9HS5S04.json', 'hass/y5_hass_AC9HS5S05.json',
      'hass/y5_hass_AC9HS5S06.json', 'hass/y5_hass_AC9HS5S07.json', 'hass/y6_hass_AC9HS6S01.json',
      'hass/y6_hass_AC9HS6S02.json', 'hass/y6_hass_AC9HS6S03.json', 'hass/y6_hass_AC9HS6S04.json',
      'hass/y6_hass_AC9HS6S05.json', 'hass/y6_hass_AC9HS6S06.json', 'hass/y6_hass_AC9HS6S07.json',
      'history/y7_history_AC9HH7S01.json', 'history/y7_history_AC9HH7S02.json', 'history/y7_history_AC9HH7S03.json',
      'history/y7_history_AC9HH7S04.json', 'history/y7_history_AC9HH7S05.json', 'history/y7_history_AC9HH7S06.json',
      'history/y7_history_AC9HH7S07.json', 'history/y7_history_AC9HH7S08.json', 'history/y8_history_AC9HH8S01.json',
      'history/y8_history_AC9HH8S02.json', 'history/y8_history_AC9HH8S03.json', 'history/y8_history_AC9HH8S04.json',
      'history/y8_history_AC9HH8S05.json', 'history/y8_history_AC9HH8S06.json', 'history/y8_history_AC9HH8S07.json',
      'history/y8_history_AC9HH8S08.json', 'history/y9_history_AC9HH9S01.json', 'history/y9_history_AC9HH9S02.json',
      'history/y9_history_AC9HH9S03.json', 'history/y9_history_AC9HH9S04.json', 'history/y9_history_AC9HH9S05.json',
      'history/y9_history_AC9HH9S06.json', 'history/y9_history_AC9HH9S07.json', 'history/y9_history_AC9HH9S08.json',
      'history/y10_history_AC9HH10S01.json', 'history/y10_history_AC9HH10S02.json', 'history/y10_history_AC9HH10S03.json',
      'history/y10_history_AC9HH10S04.json', 'history/y10_history_AC9HH10S05.json', 'history/y10_history_AC9HH10S06.json',
      'history/y10_history_AC9HH10S07.json', 'history/y10_history_AC9HH10S08.json',
    ],
    authoredYears: ['F', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
    topics: {
      '7': [
        { key: 'Y7_deep_time', label: 'Landscapes and Landforms (Deep Time)' },
        { key: 'Y7_ancient', label: 'The Ancient World' },
      ],
      '8': [
        { key: 'Y8_medieval', label: 'The Medieval World' },
        { key: 'Y8_empires', label: 'Expanding Contacts (Empires)' },
        { key: 'Y8_asia_pacific', label: 'Asia and the Pacific' },
      ],
      '9': [
        { key: 'Y9_australian_nation', label: 'Making the Australian Nation' },
        { key: 'Y9_ww1', label: 'World War I' },
        { key: 'Y9_industrial', label: 'The Industrial Revolution' },
        { key: 'Y9_asia_world', label: 'Australia and Asia' },
      ],
      '10': [
        { key: 'Y10_ww2', label: 'World War II' },
        { key: 'Y10_modern_australia', label: 'Rights and Freedoms' },
        { key: 'Y10_globalising', label: 'The Globalising World' },
      ],
    },
  },
  {
    id: 'geography',
    label: 'Geography',
    dataFile: 'hass/hass_progression_map.json',
    nodeFiles: [
      // YF
      'hass/yf_hass_AC9HSFK03.json', 'hass/yf_hass_AC9HSFK04.json',
      // Y1
      'hass/y1_hass_AC9HS1K03.json', 'hass/y1_hass_AC9HS1K04.json',
      // Y2
      'hass/y2_hass_AC9HS2K03.json', 'hass/y2_hass_AC9HS2K04.json',
      // Y3
      'hass/y3_hass_AC9HS3K03.json', 'hass/y3_hass_AC9HS3K04.json', 'hass/y3_hass_AC9HS3K05.json',
      // Y4
      'hass/y4_hass_AC9HS4K05.json', 'hass/y4_hass_AC9HS4K06.json',
      // Y5
      'hass/y5_hass_AC9HS5K04.json', 'hass/y5_hass_AC9HS5K05.json',
      // Y6
      'hass/y6_hass_AC9HS6K04.json', 'hass/y6_hass_AC9HS6K05.json',
      // Y7
      'geography/y7_geography_AC9HG7K01.json', 'geography/y7_geography_AC9HG7K02.json', 'geography/y7_geography_AC9HG7K03.json',
      'geography/y7_geography_AC9HG7K04.json', 'geography/y7_geography_AC9HG7K05.json', 'geography/y7_geography_AC9HG7K06.json',
      'geography/y7_geography_AC9HG7K07.json', 'geography/y7_geography_AC9HG7K08.json',
      // Y8
      'geography/y8_geography_AC9HG8K01.json', 'geography/y8_geography_AC9HG8K02.json', 'geography/y8_geography_AC9HG8K03.json',
      'geography/y8_geography_AC9HG8K04.json', 'geography/y8_geography_AC9HG8K05.json', 'geography/y8_geography_AC9HG8K06.json',
      'geography/y8_geography_AC9HG8K07.json', 'geography/y8_geography_AC9HG8K08.json', 'geography/y8_geography_AC9HG8K09.json',
      // Y9
      'geography/y9_geography_AC9HG9K01.json', 'geography/y9_geography_AC9HG9K02.json', 'geography/y9_geography_AC9HG9K03.json',
      'geography/y9_geography_AC9HG9K04.json', 'geography/y9_geography_AC9HG9K05.json', 'geography/y9_geography_AC9HG9K06.json',
      'geography/y9_geography_AC9HG9K07.json', 'geography/y9_geography_AC9HG9K08.json',
      // Y10
      'geography/y10_geography_AC9HG10K01.json', 'geography/y10_geography_AC9HG10K02.json', 'geography/y10_geography_AC9HG10K03.json',
      'geography/y10_geography_AC9HG10K04.json', 'geography/y10_geography_AC9HG10K05.json', 'geography/y10_geography_AC9HG10K06.json',
      'geography/y10_geography_AC9HG10K07.json', 'geography/y10_geography_AC9HG10K08.json',
      // Capability
      'hass/yf_hass_AC9HSFS01.json', 'hass/yf_hass_AC9HSFS02.json', 'hass/yf_hass_AC9HSFS03.json',
      'hass/yf_hass_AC9HSFS04.json', 'hass/yf_hass_AC9HSFS05.json', 'hass/y1_hass_AC9HS1S01.json',
      'hass/y1_hass_AC9HS1S02.json', 'hass/y1_hass_AC9HS1S03.json', 'hass/y1_hass_AC9HS1S04.json',
      'hass/y1_hass_AC9HS1S05.json', 'hass/y1_hass_AC9HS1S06.json', 'hass/y2_hass_AC9HS2S01.json',
      'hass/y2_hass_AC9HS2S02.json', 'hass/y2_hass_AC9HS2S03.json', 'hass/y2_hass_AC9HS2S04.json',
      'hass/y2_hass_AC9HS2S05.json', 'hass/y2_hass_AC9HS2S06.json', 'hass/y3_hass_AC9HS3S01.json',
      'hass/y3_hass_AC9HS3S02.json', 'hass/y3_hass_AC9HS3S03.json', 'hass/y3_hass_AC9HS3S04.json',
      'hass/y3_hass_AC9HS3S05.json', 'hass/y3_hass_AC9HS3S06.json', 'hass/y3_hass_AC9HS3S07.json',
      'hass/y4_hass_AC9HS4S01.json', 'hass/y4_hass_AC9HS4S02.json', 'hass/y4_hass_AC9HS4S03.json',
      'hass/y4_hass_AC9HS4S04.json', 'hass/y4_hass_AC9HS4S05.json', 'hass/y4_hass_AC9HS4S06.json',
      'hass/y4_hass_AC9HS4S07.json', 'hass/y5_hass_AC9HS5S01.json', 'hass/y5_hass_AC9HS5S02.json',
      'hass/y5_hass_AC9HS5S03.json', 'hass/y5_hass_AC9HS5S04.json', 'hass/y5_hass_AC9HS5S05.json',
      'hass/y5_hass_AC9HS5S06.json', 'hass/y5_hass_AC9HS5S07.json', 'hass/y6_hass_AC9HS6S01.json',
      'hass/y6_hass_AC9HS6S02.json', 'hass/y6_hass_AC9HS6S03.json', 'hass/y6_hass_AC9HS6S04.json',
      'hass/y6_hass_AC9HS6S05.json', 'hass/y6_hass_AC9HS6S06.json', 'hass/y6_hass_AC9HS6S07.json',
      'geography/y7_geography_AC9HG7S01.json', 'geography/y7_geography_AC9HG7S02.json', 'geography/y7_geography_AC9HG7S03.json',
      'geography/y7_geography_AC9HG7S04.json', 'geography/y7_geography_AC9HG7S05.json', 'geography/y7_geography_AC9HG7S06.json',
      'geography/y8_geography_AC9HG8S01.json', 'geography/y8_geography_AC9HG8S02.json', 'geography/y8_geography_AC9HG8S03.json',
      'geography/y8_geography_AC9HG8S04.json', 'geography/y8_geography_AC9HG8S05.json', 'geography/y8_geography_AC9HG8S06.json',
      'geography/y9_geography_AC9HG9S01.json', 'geography/y9_geography_AC9HG9S02.json', 'geography/y9_geography_AC9HG9S03.json',
      'geography/y9_geography_AC9HG9S04.json', 'geography/y9_geography_AC9HG9S05.json', 'geography/y9_geography_AC9HG9S06.json',
      'geography/y10_geography_AC9HG10S01.json', 'geography/y10_geography_AC9HG10S02.json', 'geography/y10_geography_AC9HG10S03.json',
      'geography/y10_geography_AC9HG10S04.json', 'geography/y10_geography_AC9HG10S05.json', 'geography/y10_geography_AC9HG10S06.json',
    ],
    authoredYears: ['F', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
    topics: {
      '7': [
        { key: 'Y7_water', label: 'Water in the World' },
        { key: 'Y7_liveability', label: 'Place and Liveability' },
      ],
      '8': [
        { key: 'Y8_landforms', label: 'Landforms and Landscapes' },
        { key: 'Y8_nations', label: 'Changing Nations' },
      ],
      '9': [
        { key: 'Y9_biomes', label: 'Biomes and Food Security' },
        { key: 'Y9_interconnections', label: 'Geographies of Interconnections' },
      ],
      '10': [
        { key: 'Y10_environment', label: 'Environmental Change and Management' },
        { key: 'Y10_wellbeing', label: 'Geographies of Human Wellbeing' },
      ],
    },
  },
  {
    id: 'civics',
    label: 'Civics',
    dataFile: 'hass/hass_progression_map.json',
    nodeFiles: [
      // Y3
      'hass/y3_hass_AC9HS3K06.json', 'hass/y3_hass_AC9HS3K07.json',
      // Y4
      'hass/y4_hass_AC9HS4K07.json', 'hass/y4_hass_AC9HS4K08.json', 'hass/y4_hass_AC9HS4K09.json',
      // Y5
      'hass/y5_hass_AC9HS5K06.json', 'hass/y5_hass_AC9HS5K07.json',
      // Y6
      'hass/y6_hass_AC9HS6K06.json', 'hass/y6_hass_AC9HS6K07.json',
      // Y7
      'civics/y7_civics_AC9HC7K01.json', 'civics/y7_civics_AC9HC7K02.json', 'civics/y7_civics_AC9HC7K03.json',
      'civics/y7_civics_AC9HC7K04.json', 'civics/y7_civics_AC9HC7K05.json',
      // Y8
      'civics/y8_civics_AC9HC8K01.json', 'civics/y8_civics_AC9HC8K02.json', 'civics/y8_civics_AC9HC8K03.json',
      'civics/y8_civics_AC9HC8K04.json', 'civics/y8_civics_AC9HC8K05.json', 'civics/y8_civics_AC9HC8K06.json',
      // Y9
      'civics/y9_civics_AC9HC9K01.json', 'civics/y9_civics_AC9HC9K02.json', 'civics/y9_civics_AC9HC9K03.json',
      'civics/y9_civics_AC9HC9K04.json', 'civics/y9_civics_AC9HC9K05.json', 'civics/y9_civics_AC9HC9K06.json',
      // Y10
      'civics/y10_civics_AC9HC10K01.json', 'civics/y10_civics_AC9HC10K02.json', 'civics/y10_civics_AC9HC10K03.json',
      'civics/y10_civics_AC9HC10K04.json', 'civics/y10_civics_AC9HC10K05.json',
      // Capability
      'hass/y3_hass_AC9HS3S01.json', 'hass/y3_hass_AC9HS3S02.json', 'hass/y3_hass_AC9HS3S03.json',
      'hass/y3_hass_AC9HS3S04.json', 'hass/y3_hass_AC9HS3S05.json', 'hass/y3_hass_AC9HS3S06.json',
      'hass/y3_hass_AC9HS3S07.json', 'hass/y4_hass_AC9HS4S01.json', 'hass/y4_hass_AC9HS4S02.json',
      'hass/y4_hass_AC9HS4S03.json', 'hass/y4_hass_AC9HS4S04.json', 'hass/y4_hass_AC9HS4S05.json',
      'hass/y4_hass_AC9HS4S06.json', 'hass/y4_hass_AC9HS4S07.json', 'hass/y5_hass_AC9HS5S01.json',
      'hass/y5_hass_AC9HS5S02.json', 'hass/y5_hass_AC9HS5S03.json', 'hass/y5_hass_AC9HS5S04.json',
      'hass/y5_hass_AC9HS5S05.json', 'hass/y5_hass_AC9HS5S06.json', 'hass/y5_hass_AC9HS5S07.json',
      'hass/y6_hass_AC9HS6S01.json', 'hass/y6_hass_AC9HS6S02.json', 'hass/y6_hass_AC9HS6S03.json',
      'hass/y6_hass_AC9HS6S04.json', 'hass/y6_hass_AC9HS6S05.json', 'hass/y6_hass_AC9HS6S06.json',
      'hass/y6_hass_AC9HS6S07.json', 'civics/y7_civics_AC9HC7S01.json', 'civics/y7_civics_AC9HC7S02.json',
      'civics/y7_civics_AC9HC7S03.json', 'civics/y7_civics_AC9HC7S04.json', 'civics/y7_civics_AC9HC7S05.json',
      'civics/y8_civics_AC9HC8S01.json', 'civics/y8_civics_AC9HC8S02.json', 'civics/y8_civics_AC9HC8S03.json',
      'civics/y8_civics_AC9HC8S04.json', 'civics/y8_civics_AC9HC8S05.json', 'civics/y9_civics_AC9HC9S01.json',
      'civics/y9_civics_AC9HC9S02.json', 'civics/y9_civics_AC9HC9S03.json', 'civics/y9_civics_AC9HC9S04.json',
      'civics/y9_civics_AC9HC9S05.json', 'civics/y10_civics_AC9HC10S01.json', 'civics/y10_civics_AC9HC10S02.json',
      'civics/y10_civics_AC9HC10S03.json', 'civics/y10_civics_AC9HC10S04.json', 'civics/y10_civics_AC9HC10S05.json',
    ],
    authoredYears: ['3', '4', '5', '6', '7', '8', '9', '10'],
  },
  {
    id: 'economics',
    label: 'Economics',
    dataFile: 'hass/hass_progression_map.json',
    nodeFiles: [
      // Y5
      'hass/y5_hass_AC9HS5K08.json',
      // Y6
      'hass/y6_hass_AC9HS6K08.json',
      // Y7
      'economics/y7_economics_AC9HE7K01.json', 'economics/y7_economics_AC9HE7K02.json', 'economics/y7_economics_AC9HE7K03.json',
      'economics/y7_economics_AC9HE7K04.json', 'economics/y7_economics_AC9HE7K05.json',
      // Y8
      'economics/y8_economics_AC9HE8K01.json', 'economics/y8_economics_AC9HE8K02.json', 'economics/y8_economics_AC9HE8K03.json',
      'economics/y8_economics_AC9HE8K04.json', 'economics/y8_economics_AC9HE8K05.json',
      // Y9
      'economics/y9_economics_AC9HE9K01.json', 'economics/y9_economics_AC9HE9K02.json', 'economics/y9_economics_AC9HE9K03.json',
      'economics/y9_economics_AC9HE9K04.json', 'economics/y9_economics_AC9HE9K05.json',
      // Y10
      'economics/y10_economics_AC9HE10K01.json', 'economics/y10_economics_AC9HE10K02.json', 'economics/y10_economics_AC9HE10K03.json',
      'economics/y10_economics_AC9HE10K04.json', 'economics/y10_economics_AC9HE10K05.json',
      // Capability
      'hass/y5_hass_AC9HS5S01.json', 'hass/y5_hass_AC9HS5S02.json', 'hass/y5_hass_AC9HS5S03.json',
      'hass/y5_hass_AC9HS5S04.json', 'hass/y5_hass_AC9HS5S05.json', 'hass/y5_hass_AC9HS5S06.json',
      'hass/y5_hass_AC9HS5S07.json', 'hass/y6_hass_AC9HS6S01.json', 'hass/y6_hass_AC9HS6S02.json',
      'hass/y6_hass_AC9HS6S03.json', 'hass/y6_hass_AC9HS6S04.json', 'hass/y6_hass_AC9HS6S05.json',
      'hass/y6_hass_AC9HS6S06.json', 'hass/y6_hass_AC9HS6S07.json', 'economics/y7_economics_AC9HE7S01.json',
      'economics/y7_economics_AC9HE7S02.json', 'economics/y7_economics_AC9HE7S03.json', 'economics/y7_economics_AC9HE7S04.json',
      'economics/y7_economics_AC9HE7S05.json', 'economics/y8_economics_AC9HE8S01.json', 'economics/y8_economics_AC9HE8S02.json',
      'economics/y8_economics_AC9HE8S03.json', 'economics/y8_economics_AC9HE8S04.json', 'economics/y8_economics_AC9HE8S05.json',
      'economics/y9_economics_AC9HE9S01.json', 'economics/y9_economics_AC9HE9S02.json', 'economics/y9_economics_AC9HE9S03.json',
      'economics/y9_economics_AC9HE9S04.json', 'economics/y9_economics_AC9HE9S05.json', 'economics/y10_economics_AC9HE10S01.json',
      'economics/y10_economics_AC9HE10S02.json', 'economics/y10_economics_AC9HE10S03.json', 'economics/y10_economics_AC9HE10S04.json',
      'economics/y10_economics_AC9HE10S05.json',
    ],
    authoredYears: ['5', '6', '7', '8', '9', '10'],
  },
  {
    id: 'design_technologies',
    label: 'Design Technologies',
    dataFile: 'technologies/technologies_progression_map.json',
    nodeFiles: [
      'technologies/yf_design_AC9TDEFK01.json',
      'technologies/y12_design_AC9TDE2K01.json', 'technologies/y12_design_AC9TDE2K02.json',
      'technologies/y12_design_AC9TDE2K03.json', 'technologies/y12_design_AC9TDE2K04.json',
      'technologies/y34_design_AC9TDE4K01.json', 'technologies/y34_design_AC9TDE4K02.json',
      'technologies/y34_design_AC9TDE4K03.json', 'technologies/y34_design_AC9TDE4K04.json',
      'technologies/y56_design_AC9TDE6K01.json', 'technologies/y56_design_AC9TDE6K02.json',
      'technologies/y56_design_AC9TDE6K03.json', 'technologies/y56_design_AC9TDE6K04.json',
      'technologies/y56_design_AC9TDE6K05.json',
      'technologies/y78_design_AC9TDE8K01.json', 'technologies/y78_design_AC9TDE8K02.json',
      'technologies/y78_design_AC9TDE8K03.json', 'technologies/y78_design_AC9TDE8K04.json',
      'technologies/y78_design_AC9TDE8K05.json', 'technologies/y78_design_AC9TDE8K06.json',
      'technologies/y910_design_AC9TDE10K01.json', 'technologies/y910_design_AC9TDE10K02.json',
      'technologies/y910_design_AC9TDE10K03.json', 'technologies/y910_design_AC9TDE10K04.json',
      'technologies/y910_design_AC9TDE10K05.json', 'technologies/y910_design_AC9TDE10K06.json',
      // Capability
      'technologies/yf_design_AC9TDEFP01.json', 'technologies/y12_design_AC9TDE2P01.json', 'technologies/y12_design_AC9TDE2P02.json',
      'technologies/y12_design_AC9TDE2P03.json', 'technologies/y12_design_AC9TDE2P04.json', 'technologies/y34_design_AC9TDE4P01.json',
      'technologies/y34_design_AC9TDE4P02.json', 'technologies/y34_design_AC9TDE4P03.json', 'technologies/y34_design_AC9TDE4P04.json',
      'technologies/y34_design_AC9TDE4P05.json', 'technologies/y56_design_AC9TDE6P01.json', 'technologies/y56_design_AC9TDE6P02.json',
      'technologies/y56_design_AC9TDE6P03.json', 'technologies/y56_design_AC9TDE6P04.json', 'technologies/y56_design_AC9TDE6P05.json',
      'technologies/y78_design_AC9TDE8P01.json', 'technologies/y78_design_AC9TDE8P02.json', 'technologies/y78_design_AC9TDE8P03.json',
      'technologies/y78_design_AC9TDE8P04.json', 'technologies/y78_design_AC9TDE8P05.json', 'technologies/y910_design_AC9TDE10P01.json',
      'technologies/y910_design_AC9TDE10P02.json', 'technologies/y910_design_AC9TDE10P03.json', 'technologies/y910_design_AC9TDE10P04.json',
      'technologies/y910_design_AC9TDE10P05.json',
    ],
    authoredYears: ['F', '1-2', '3-4', '5-6', '7-8', '9-10'],
  },
  {
    id: 'digital_technologies',
    label: 'Digital Technologies',
    dataFile: 'technologies/technologies_progression_map.json',
    nodeFiles: [
      'technologies/yf_dt_AC9TDIFK01.json', 'technologies/yf_dt_AC9TDIFK02.json',
      'technologies/y12_dt_AC9TDI2K01.json', 'technologies/y12_dt_AC9TDI2K02.json',
      'technologies/y34_dt_AC9TDI4K01.json', 'technologies/y34_dt_AC9TDI4K02.json', 'technologies/y34_dt_AC9TDI4K03.json',
      'technologies/y56_dt_AC9TDI6K01.json', 'technologies/y56_dt_AC9TDI6K02.json',
      'technologies/y56_dt_AC9TDI6K03.json', 'technologies/y56_dt_AC9TDI6K04.json',
      'technologies/y78_dt_AC9TDI8K01.json', 'technologies/y78_dt_AC9TDI8K02.json',
      'technologies/y78_dt_AC9TDI8K03.json', 'technologies/y78_dt_AC9TDI8K04.json',
      'technologies/y910_dt_AC9TDI10K01.json', 'technologies/y910_dt_AC9TDI10K02.json',
      'technologies/y910_dt_AC9TDI10K03.json',
      // Capability
      'technologies/y78_dt_AC9TDI8P01.json', 'technologies/y78_dt_AC9TDI8P02.json', 'technologies/y78_dt_AC9TDI8P03.json',
      'technologies/y78_dt_AC9TDI8P04.json', 'technologies/y78_dt_AC9TDI8P05.json', 'technologies/y78_dt_AC9TDI8P06.json',
      'technologies/y78_dt_AC9TDI8P07.json', 'technologies/y78_dt_AC9TDI8P08.json', 'technologies/y78_dt_AC9TDI8P09.json',
      'technologies/y78_dt_AC9TDI8P10.json', 'technologies/y78_dt_AC9TDI8P11.json', 'technologies/y78_dt_AC9TDI8P12.json',
      'technologies/y78_dt_AC9TDI8P13.json', 'technologies/y910_dt_AC9TDI10P01.json', 'technologies/y910_dt_AC9TDI10P02.json',
      'technologies/y910_dt_AC9TDI10P03.json', 'technologies/y910_dt_AC9TDI10P04.json', 'technologies/y910_dt_AC9TDI10P05.json',
      'technologies/y910_dt_AC9TDI10P06.json', 'technologies/y910_dt_AC9TDI10P07.json', 'technologies/y910_dt_AC9TDI10P08.json',
      'technologies/y910_dt_AC9TDI10P09.json', 'technologies/y910_dt_AC9TDI10P10.json', 'technologies/y910_dt_AC9TDI10P11.json',
      'technologies/y910_dt_AC9TDI10P12.json', 'technologies/y910_dt_AC9TDI10P13.json', 'technologies/y910_dt_AC9TDI10P14.json',
    ],
    authoredYears: ['F', '1-2', '3-4', '5-6', '7-8', '9-10'],
  },
  // Add these three entries to SUBJECTS in Signal's src/lib/config/subjects.ts
// (insert before the closing `];`). No widthFiles field — Signal's
// SubjectConfig does not use width tiers.

  {
    id: 'hpe',
    label: 'HPE',
    dataFile: 'hpe/hpe_progression_map.json',
    nodeFiles: [
      'hpe/yf_hpe_AC9HPFM01.json', 'hpe/yf_hpe_AC9HPFM02.json', 'hpe/yf_hpe_AC9HPFM03.json',
      'hpe/yf_hpe_AC9HPFM04.json', 'hpe/yf_hpe_AC9HPFP01.json', 'hpe/yf_hpe_AC9HPFP02.json',
      'hpe/yf_hpe_AC9HPFP03.json', 'hpe/yf_hpe_AC9HPFP04.json', 'hpe/yf_hpe_AC9HPFP05.json',
      'hpe/yf_hpe_AC9HPFP06.json', 'hpe/y12_hpe_AC9HP2M01.json', 'hpe/y12_hpe_AC9HP2M02.json',
      'hpe/y12_hpe_AC9HP2M03.json', 'hpe/y12_hpe_AC9HP2M04.json', 'hpe/y12_hpe_AC9HP2M05.json',
      'hpe/y12_hpe_AC9HP2P01.json', 'hpe/y12_hpe_AC9HP2P02.json', 'hpe/y12_hpe_AC9HP2P03.json',
      'hpe/y12_hpe_AC9HP2P04.json', 'hpe/y12_hpe_AC9HP2P05.json', 'hpe/y12_hpe_AC9HP2P06.json',
      'hpe/y34_hpe_AC9HP4M01.json', 'hpe/y34_hpe_AC9HP4M02.json', 'hpe/y34_hpe_AC9HP4M03.json',
      'hpe/y34_hpe_AC9HP4M04.json', 'hpe/y34_hpe_AC9HP4M05.json', 'hpe/y34_hpe_AC9HP4M06.json',
      'hpe/y34_hpe_AC9HP4M07.json', 'hpe/y34_hpe_AC9HP4M08.json', 'hpe/y34_hpe_AC9HP4M09.json',
      'hpe/y34_hpe_AC9HP4P01.json', 'hpe/y34_hpe_AC9HP4P02.json', 'hpe/y34_hpe_AC9HP4P03.json',
      'hpe/y34_hpe_AC9HP4P04.json', 'hpe/y34_hpe_AC9HP4P05.json', 'hpe/y34_hpe_AC9HP4P06.json',
      'hpe/y34_hpe_AC9HP4P07.json', 'hpe/y34_hpe_AC9HP4P08.json', 'hpe/y34_hpe_AC9HP4P09.json',
      'hpe/y34_hpe_AC9HP4P10.json', 'hpe/y56_hpe_AC9HP6M01.json', 'hpe/y56_hpe_AC9HP6M02.json',
      'hpe/y56_hpe_AC9HP6M03.json', 'hpe/y56_hpe_AC9HP6M04.json', 'hpe/y56_hpe_AC9HP6M05.json',
      'hpe/y56_hpe_AC9HP6M06.json', 'hpe/y56_hpe_AC9HP6M07.json', 'hpe/y56_hpe_AC9HP6M08.json',
      'hpe/y56_hpe_AC9HP6M09.json', 'hpe/y56_hpe_AC9HP6P01.json', 'hpe/y56_hpe_AC9HP6P02.json',
      'hpe/y56_hpe_AC9HP6P03.json', 'hpe/y56_hpe_AC9HP6P04.json', 'hpe/y56_hpe_AC9HP6P05.json',
      'hpe/y56_hpe_AC9HP6P06.json', 'hpe/y56_hpe_AC9HP6P07.json', 'hpe/y56_hpe_AC9HP6P08.json',
      'hpe/y56_hpe_AC9HP6P09.json', 'hpe/y56_hpe_AC9HP6P10.json', 'hpe/y78_hpe_AC9HP8M01.json',
      'hpe/y78_hpe_AC9HP8M02.json', 'hpe/y78_hpe_AC9HP8M03.json', 'hpe/y78_hpe_AC9HP8M04.json',
      'hpe/y78_hpe_AC9HP8M05.json', 'hpe/y78_hpe_AC9HP8M06.json', 'hpe/y78_hpe_AC9HP8M07.json',
      'hpe/y78_hpe_AC9HP8M08.json', 'hpe/y78_hpe_AC9HP8M09.json', 'hpe/y78_hpe_AC9HP8P01.json',
      'hpe/y78_hpe_AC9HP8P02.json', 'hpe/y78_hpe_AC9HP8P03.json', 'hpe/y78_hpe_AC9HP8P04.json',
      'hpe/y78_hpe_AC9HP8P05.json', 'hpe/y78_hpe_AC9HP8P06.json', 'hpe/y78_hpe_AC9HP8P07.json',
      'hpe/y78_hpe_AC9HP8P08.json', 'hpe/y78_hpe_AC9HP8P09.json', 'hpe/y78_hpe_AC9HP8P10.json',
      'hpe/y910_hpe_AC9HP10M01.json', 'hpe/y910_hpe_AC9HP10M02.json', 'hpe/y910_hpe_AC9HP10M03.json',
      'hpe/y910_hpe_AC9HP10M04.json', 'hpe/y910_hpe_AC9HP10M05.json', 'hpe/y910_hpe_AC9HP10M06.json',
      'hpe/y910_hpe_AC9HP10M07.json', 'hpe/y910_hpe_AC9HP10M08.json', 'hpe/y910_hpe_AC9HP10M09.json',
      'hpe/y910_hpe_AC9HP10P01.json', 'hpe/y910_hpe_AC9HP10P02.json', 'hpe/y910_hpe_AC9HP10P03.json',
      'hpe/y910_hpe_AC9HP10P04.json', 'hpe/y910_hpe_AC9HP10P05.json', 'hpe/y910_hpe_AC9HP10P06.json',
      'hpe/y910_hpe_AC9HP10P07.json', 'hpe/y910_hpe_AC9HP10P08.json', 'hpe/y910_hpe_AC9HP10P09.json',
      'hpe/y910_hpe_AC9HP10P10.json',
    ],
    authoredYears: ['F', '1-2', '3-4', '5-6', '7-8', '9-10'],
  },
  {
    id: 'arts',
    label: 'The Arts',
    dataFile: 'arts/arts_progression_map.json',
    nodeFiles: [
      'arts/yf_dance_AC9ADAFC01.json', 'arts/yf_dance_AC9ADAFD01.json', 'arts/yf_dance_AC9ADAFE01.json',
      'arts/yf_dance_AC9ADAFP01.json', 'arts/y12_dance_AC9ADA2C01.json', 'arts/y12_dance_AC9ADA2D01.json',
      'arts/y12_dance_AC9ADA2E01.json', 'arts/y12_dance_AC9ADA2E02.json', 'arts/y12_dance_AC9ADA2P01.json',
      'arts/y34_dance_AC9ADA4C01.json', 'arts/y34_dance_AC9ADA4D01.json', 'arts/y34_dance_AC9ADA4E01.json',
      'arts/y34_dance_AC9ADA4E02.json', 'arts/y34_dance_AC9ADA4P01.json', 'arts/y56_dance_AC9ADA6C01.json',
      'arts/y56_dance_AC9ADA6D01.json', 'arts/y56_dance_AC9ADA6E01.json', 'arts/y56_dance_AC9ADA6E02.json',
      'arts/y56_dance_AC9ADA6P01.json', 'arts/y78_dance_AC9ADA8C01.json', 'arts/y78_dance_AC9ADA8C02.json',
      'arts/y78_dance_AC9ADA8D01.json', 'arts/y78_dance_AC9ADA8D02.json', 'arts/y78_dance_AC9ADA8E01.json',
      'arts/y78_dance_AC9ADA8E02.json', 'arts/y78_dance_AC9ADA8P01.json', 'arts/y910_dance_AC9ADA10C01.json',
      'arts/y910_dance_AC9ADA10C02.json', 'arts/y910_dance_AC9ADA10D01.json', 'arts/y910_dance_AC9ADA10D02.json',
      'arts/y910_dance_AC9ADA10E01.json', 'arts/y910_dance_AC9ADA10E02.json', 'arts/y910_dance_AC9ADA10P01.json',
      'arts/yf_drama_AC9ADRFC01.json', 'arts/yf_drama_AC9ADRFD01.json', 'arts/yf_drama_AC9ADRFE01.json',
      'arts/yf_drama_AC9ADRFP01.json', 'arts/y12_drama_AC9ADR2C01.json', 'arts/y12_drama_AC9ADR2D01.json',
      'arts/y12_drama_AC9ADR2E01.json', 'arts/y12_drama_AC9ADR2E02.json', 'arts/y12_drama_AC9ADR2P01.json',
      'arts/y34_drama_AC9ADR4C01.json', 'arts/y34_drama_AC9ADR4D01.json', 'arts/y34_drama_AC9ADR4E01.json',
      'arts/y34_drama_AC9ADR4E02.json', 'arts/y34_drama_AC9ADR4P01.json', 'arts/y56_drama_AC9ADR6C01.json',
      'arts/y56_drama_AC9ADR6D01.json', 'arts/y56_drama_AC9ADR6E01.json', 'arts/y56_drama_AC9ADR6E02.json',
      'arts/y56_drama_AC9ADR6P01.json', 'arts/y78_drama_AC9ADR8C01.json', 'arts/y78_drama_AC9ADR8C02.json',
      'arts/y78_drama_AC9ADR8D01.json', 'arts/y78_drama_AC9ADR8D02.json', 'arts/y78_drama_AC9ADR8E01.json',
      'arts/y78_drama_AC9ADR8E02.json', 'arts/y78_drama_AC9ADR8P01.json', 'arts/y910_drama_AC9ADR10C01.json',
      'arts/y910_drama_AC9ADR10C02.json', 'arts/y910_drama_AC9ADR10D01.json', 'arts/y910_drama_AC9ADR10D02.json',
      'arts/y910_drama_AC9ADR10E01.json', 'arts/y910_drama_AC9ADR10E02.json', 'arts/y910_drama_AC9ADR10P01.json',
      'arts/yf_media_arts_AC9AMAFC01.json', 'arts/yf_media_arts_AC9AMAFD01.json', 'arts/yf_media_arts_AC9AMAFE01.json',
      'arts/yf_media_arts_AC9AMAFP01.json', 'arts/y12_media_arts_AC9AMA2C01.json', 'arts/y12_media_arts_AC9AMA2D01.json',
      'arts/y12_media_arts_AC9AMA2E01.json', 'arts/y12_media_arts_AC9AMA2E02.json', 'arts/y12_media_arts_AC9AMA2P01.json',
      'arts/y34_media_arts_AC9AMA4C01.json', 'arts/y34_media_arts_AC9AMA4D01.json', 'arts/y34_media_arts_AC9AMA4E01.json',
      'arts/y34_media_arts_AC9AMA4E02.json', 'arts/y34_media_arts_AC9AMA4P01.json', 'arts/y56_media_arts_AC9AMA6C01.json',
      'arts/y56_media_arts_AC9AMA6D01.json', 'arts/y56_media_arts_AC9AMA6E01.json', 'arts/y56_media_arts_AC9AMA6E02.json',
      'arts/y56_media_arts_AC9AMA6P01.json', 'arts/y78_media_arts_AC9AMA8C01.json', 'arts/y78_media_arts_AC9AMA8C02.json',
      'arts/y78_media_arts_AC9AMA8D01.json', 'arts/y78_media_arts_AC9AMA8D02.json', 'arts/y78_media_arts_AC9AMA8E01.json',
      'arts/y78_media_arts_AC9AMA8E02.json', 'arts/y78_media_arts_AC9AMA8P01.json', 'arts/y910_media_arts_AC9AMA10C01.json',
      'arts/y910_media_arts_AC9AMA10C02.json', 'arts/y910_media_arts_AC9AMA10D01.json', 'arts/y910_media_arts_AC9AMA10D02.json',
      'arts/y910_media_arts_AC9AMA10E01.json', 'arts/y910_media_arts_AC9AMA10E02.json', 'arts/y910_media_arts_AC9AMA10P01.json',
      'arts/yf_music_AC9AMUFC01.json', 'arts/yf_music_AC9AMUFD01.json', 'arts/yf_music_AC9AMUFE01.json',
      'arts/yf_music_AC9AMUFP01.json', 'arts/y12_music_AC9AMU2C01.json', 'arts/y12_music_AC9AMU2D01.json',
      'arts/y12_music_AC9AMU2E01.json', 'arts/y12_music_AC9AMU2E02.json', 'arts/y12_music_AC9AMU2P01.json',
      'arts/y34_music_AC9AMU4C01.json', 'arts/y34_music_AC9AMU4D01.json', 'arts/y34_music_AC9AMU4E01.json',
      'arts/y34_music_AC9AMU4E02.json', 'arts/y34_music_AC9AMU4P01.json', 'arts/y56_music_AC9AMU6C01.json',
      'arts/y56_music_AC9AMU6D01.json', 'arts/y56_music_AC9AMU6E01.json', 'arts/y56_music_AC9AMU6E02.json',
      'arts/y56_music_AC9AMU6P01.json', 'arts/y78_music_AC9AMU8C01.json', 'arts/y78_music_AC9AMU8C02.json',
      'arts/y78_music_AC9AMU8D01.json', 'arts/y78_music_AC9AMU8D02.json', 'arts/y78_music_AC9AMU8E01.json',
      'arts/y78_music_AC9AMU8E02.json', 'arts/y78_music_AC9AMU8P01.json', 'arts/y910_music_AC9AMU10C01.json',
      'arts/y910_music_AC9AMU10C02.json', 'arts/y910_music_AC9AMU10D01.json', 'arts/y910_music_AC9AMU10D02.json',
      'arts/y910_music_AC9AMU10E01.json', 'arts/y910_music_AC9AMU10E02.json', 'arts/y910_music_AC9AMU10P01.json',
      'arts/yf_visual_arts_AC9AVAFC01.json', 'arts/yf_visual_arts_AC9AVAFD01.json', 'arts/yf_visual_arts_AC9AVAFE01.json',
      'arts/yf_visual_arts_AC9AVAFP01.json', 'arts/y12_visual_arts_AC9AVA2C01.json', 'arts/y12_visual_arts_AC9AVA2D01.json',
      'arts/y12_visual_arts_AC9AVA2E01.json', 'arts/y12_visual_arts_AC9AVA2E02.json', 'arts/y12_visual_arts_AC9AVA2P01.json',
      'arts/y34_visual_arts_AC9AVA4C01.json', 'arts/y34_visual_arts_AC9AVA4D01.json', 'arts/y34_visual_arts_AC9AVA4E01.json',
      'arts/y34_visual_arts_AC9AVA4E02.json', 'arts/y34_visual_arts_AC9AVA4P01.json', 'arts/y56_visual_arts_AC9AVA6C01.json',
      'arts/y56_visual_arts_AC9AVA6D01.json', 'arts/y56_visual_arts_AC9AVA6E01.json', 'arts/y56_visual_arts_AC9AVA6E02.json',
      'arts/y56_visual_arts_AC9AVA6P01.json', 'arts/y78_visual_arts_AC9AVA8C01.json', 'arts/y78_visual_arts_AC9AVA8C02.json',
      'arts/y78_visual_arts_AC9AVA8D01.json', 'arts/y78_visual_arts_AC9AVA8D02.json', 'arts/y78_visual_arts_AC9AVA8E01.json',
      'arts/y78_visual_arts_AC9AVA8E02.json', 'arts/y78_visual_arts_AC9AVA8P01.json', 'arts/y910_visual_arts_AC9AVA10C01.json',
      'arts/y910_visual_arts_AC9AVA10C02.json', 'arts/y910_visual_arts_AC9AVA10D01.json', 'arts/y910_visual_arts_AC9AVA10D02.json',
      'arts/y910_visual_arts_AC9AVA10E01.json', 'arts/y910_visual_arts_AC9AVA10E02.json', 'arts/y910_visual_arts_AC9AVA10P01.json',
    ],
    authoredYears: ['F', '1-2', '3-4', '5-6', '7-8', '9-10'],
  },
  {
    id: 'languages',
    label: 'Languages',
    dataFile: 'languages/languages_progression_map.json',
    nodeFiles: [
      'languages/y78_languages_entry_AC9LS8EC01.json', 'languages/y78_languages_entry_AC9LS8EC02.json', 'languages/y78_languages_entry_AC9LS8EC03.json',
      'languages/y78_languages_entry_AC9LS8EC04.json', 'languages/y78_languages_entry_AC9LS8EC05.json', 'languages/y78_languages_entry_AC9LS8EC06.json',
      'languages/y78_languages_entry_AC9LS8EU01.json', 'languages/y78_languages_entry_AC9LS8EU02.json', 'languages/y78_languages_entry_AC9LS8EU03.json',
      'languages/y78_languages_entry_AC9LS8EU04.json', 'languages/y910_languages_entry_AC9LS10EC01.json', 'languages/y910_languages_entry_AC9LS10EC02.json',
      'languages/y910_languages_entry_AC9LS10EC03.json', 'languages/y910_languages_entry_AC9LS10EC04.json', 'languages/y910_languages_entry_AC9LS10EC05.json',
      'languages/y910_languages_entry_AC9LS10EC06.json', 'languages/y910_languages_entry_AC9LS10EU01.json', 'languages/y910_languages_entry_AC9LS10EU02.json',
      'languages/y910_languages_entry_AC9LS10EU03.json', 'languages/y910_languages_entry_AC9LS10EU04.json', 'languages/f_languages_AC9LSF01.json',
      'languages/f_languages_AC9LSF02.json', 'languages/f_languages_AC9LSF03.json', 'languages/y12_languages_AC9LS2C01.json',
      'languages/y12_languages_AC9LS2C02.json', 'languages/y12_languages_AC9LS2C03.json', 'languages/y12_languages_AC9LS2C04.json',
      'languages/y12_languages_AC9LS2C05.json', 'languages/y12_languages_AC9LS2U01.json', 'languages/y12_languages_AC9LS2U02.json',
      'languages/y12_languages_AC9LS2U03.json', 'languages/y12_languages_AC9LS2U04.json', 'languages/y34_languages_AC9LS4C01.json',
      'languages/y34_languages_AC9LS4C02.json', 'languages/y34_languages_AC9LS4C03.json', 'languages/y34_languages_AC9LS4C04.json',
      'languages/y34_languages_AC9LS4C05.json', 'languages/y34_languages_AC9LS4U01.json', 'languages/y34_languages_AC9LS4U02.json',
      'languages/y34_languages_AC9LS4U03.json', 'languages/y34_languages_AC9LS4U04.json', 'languages/y56_languages_AC9LS6C01.json',
      'languages/y56_languages_AC9LS6C02.json', 'languages/y56_languages_AC9LS6C03.json', 'languages/y56_languages_AC9LS6C04.json',
      'languages/y56_languages_AC9LS6C05.json', 'languages/y56_languages_AC9LS6U01.json', 'languages/y56_languages_AC9LS6U02.json',
      'languages/y56_languages_AC9LS6U03.json', 'languages/y56_languages_AC9LS6U04.json', 'languages/y78_languages_AC9LS8C01.json',
      'languages/y78_languages_AC9LS8C02.json', 'languages/y78_languages_AC9LS8C03.json', 'languages/y78_languages_AC9LS8C04.json',
      'languages/y78_languages_AC9LS8C05.json', 'languages/y78_languages_AC9LS8U01.json', 'languages/y78_languages_AC9LS8U02.json',
      'languages/y78_languages_AC9LS8U03.json', 'languages/y78_languages_AC9LS8U04.json', 'languages/y910_languages_AC9LS10C01.json',
      'languages/y910_languages_AC9LS10C02.json', 'languages/y910_languages_AC9LS10C03.json', 'languages/y910_languages_AC9LS10C04.json',
      'languages/y910_languages_AC9LS10C05.json', 'languages/y910_languages_AC9LS10U01.json', 'languages/y910_languages_AC9LS10U02.json',
      'languages/y910_languages_AC9LS10U03.json', 'languages/y910_languages_AC9LS10U04.json', 'languages/f_languages_background_AC9LCHF01.json',
      'languages/f_languages_background_AC9LCHF02.json', 'languages/f_languages_background_AC9LCHF03.json', 'languages/y12_languages_background_AC9LCH2C01.json',
      'languages/y12_languages_background_AC9LCH2C02.json', 'languages/y12_languages_background_AC9LCH2C03.json', 'languages/y12_languages_background_AC9LCH2C04.json',
      'languages/y12_languages_background_AC9LCH2C05.json', 'languages/y12_languages_background_AC9LCH2U01.json', 'languages/y12_languages_background_AC9LCH2U02.json',
      'languages/y12_languages_background_AC9LCH2U03.json', 'languages/y12_languages_background_AC9LCH2U04.json', 'languages/y34_languages_background_AC9LCH4C01.json',
      'languages/y34_languages_background_AC9LCH4C02.json', 'languages/y34_languages_background_AC9LCH4C03.json', 'languages/y34_languages_background_AC9LCH4C04.json',
      'languages/y34_languages_background_AC9LCH4C05.json', 'languages/y34_languages_background_AC9LCH4U01.json', 'languages/y34_languages_background_AC9LCH4U02.json',
      'languages/y34_languages_background_AC9LCH4U03.json', 'languages/y34_languages_background_AC9LCH4U04.json', 'languages/y56_languages_background_AC9LCH6C01.json',
      'languages/y56_languages_background_AC9LCH6C02.json', 'languages/y56_languages_background_AC9LCH6C03.json', 'languages/y56_languages_background_AC9LCH6C04.json',
      'languages/y56_languages_background_AC9LCH6C05.json', 'languages/y56_languages_background_AC9LCH6U01.json', 'languages/y56_languages_background_AC9LCH6U02.json',
      'languages/y56_languages_background_AC9LCH6U03.json', 'languages/y56_languages_background_AC9LCH6U04.json', 'languages/y78_languages_background_AC9LCH8C01.json',
      'languages/y78_languages_background_AC9LCH8C02.json', 'languages/y78_languages_background_AC9LCH8C03.json', 'languages/y78_languages_background_AC9LCH8C04.json',
      'languages/y78_languages_background_AC9LCH8C05.json', 'languages/y78_languages_background_AC9LCH8U01.json', 'languages/y78_languages_background_AC9LCH8U02.json',
      'languages/y78_languages_background_AC9LCH8U03.json', 'languages/y78_languages_background_AC9LCH8U04.json', 'languages/y910_languages_background_AC9LCH10C01.json',
      'languages/y910_languages_background_AC9LCH10C02.json', 'languages/y910_languages_background_AC9LCH10C03.json', 'languages/y910_languages_background_AC9LCH10C04.json',
      'languages/y910_languages_background_AC9LCH10C05.json', 'languages/y910_languages_background_AC9LCH10U01.json', 'languages/y910_languages_background_AC9LCH10U02.json',
      'languages/y910_languages_background_AC9LCH10U03.json', 'languages/y910_languages_background_AC9LCH10U04.json', 'languages/y78_languages_background_entry_AC9LCH8EC01.json',
      'languages/y78_languages_background_entry_AC9LCH8EC02.json', 'languages/y78_languages_background_entry_AC9LCH8EC03.json', 'languages/y78_languages_background_entry_AC9LCH8EC04.json',
      'languages/y78_languages_background_entry_AC9LCH8EC05.json', 'languages/y78_languages_background_entry_AC9LCH8EU01.json', 'languages/y78_languages_background_entry_AC9LCH8EU02.json',
      'languages/y78_languages_background_entry_AC9LCH8EU03.json', 'languages/y78_languages_background_entry_AC9LCH8EU04.json', 'languages/y910_languages_background_entry_AC9LCH10EC01.json',
      'languages/y910_languages_background_entry_AC9LCH10EC02.json', 'languages/y910_languages_background_entry_AC9LCH10EC03.json', 'languages/y910_languages_background_entry_AC9LCH10EC04.json',
      'languages/y910_languages_background_entry_AC9LCH10EC05.json', 'languages/y910_languages_background_entry_AC9LCH10EU01.json', 'languages/y910_languages_background_entry_AC9LCH10EU02.json',
      'languages/y910_languages_background_entry_AC9LCH10EU03.json', 'languages/y910_languages_background_entry_AC9LCH10EU04.json', 'science/y7_science_AC9S7U01.json',
    ],
    authoredYears: ['F', '1-2', '3-4', '5-6', '7-8', '9-10'],
  },
];

export function getSubject(id: string): SubjectConfig | undefined {
  return SUBJECTS.find((s) => s.id === id);
}

/** Extract the curriculum code from a node file path. e.g. 'science/y7_science_AC9S7U01.json' → 'AC9S7U01' */
export function codeFromNodeFile(path: string): string {
  const filename = path.split('/').pop() ?? '';
  const parts = filename.replace('.json', '').split('_');
  return parts[parts.length - 1].toUpperCase();
}

/** Find the node file path for a given curriculum code within a subject config */
export function nodeFileForCode(subject: SubjectConfig, code: string): string | undefined {
  return subject.nodeFiles.find((f) => codeFromNodeFile(f) === code.toUpperCase());
}

/** Return node files for a given year string (e.g. '7', 'F', '7-8') */
export function nodeFilesForYear(subject: SubjectConfig, year: string): string[] {
  const prefix = year === 'F' ? 'yf_' : year.includes('-')
    ? `y${year.replace('-', '')}_`
    : `y${year}_`
  return subject.nodeFiles.filter((f) => {
    const filename = f.split('/').pop() ?? ''
    return filename.startsWith(prefix)
  })
}

/** Derive a { code, title } list from node files — title fetched lazily at runtime */
export function standardsFromNodeFiles(subject: SubjectConfig): string[] {
  return subject.nodeFiles.map(codeFromNodeFile);
}
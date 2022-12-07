import { logger } from "../lib/logger"

export const COMMON_SAMPLE_RATES = {
  /** 8Khz: telephone, walkie-talkie, low quality wireless microphone */
  telephone: 8000,

  /** 11.025Khz: Quarter Audio CD, low quality PCM, low quality MPEG */
  lowQuality: 11025,

  /** 16Khz: VoiP, VVoiP, 2 x telephone */
  voip: 16000,

  /** 22.05Khz: AM Radio, half Audio CD */
  amRadio: 22050,

  /** 32Khz: FM Radio, camcorder */
  fmRadio: 32000,

  /** 44.1Khz: Audio CD, MPEG-1 */
  cd: 44100,

  /** 48Khz Standard consumer format: TV, DVD, film, etc. */
  standard: 48000,

  /** 88.2Khz: CD recording wideband, 2 x Audio CD */
  cdStudio: 88200,

  /** 96Khz: HD DVD, high quality DVD, recording/production equipment, 2 x Standard */
  hdDvd: 96000,

  /** 176.4Khz: HDCD, 4 x Audio CD */
  hdcd: 176400,

  /** 192Khz: Extra high DVD quality, high definition recording equipment/software, 4 x Standard */
  dvdExtraHigh: 192000,

  /** 352.8Kh: Super Audio CD, Digital eXtreme Definition, 8 x Audio CD */
  superAudioCd: 352800,

  /** 2822.4Khz: SACD (Direct Stream Digital), 64 x Audio CD */
  sacd: 2822400,

  /** 5644.8Khz: 2 x SACD, 128 x Audio CD */
  sacd2x: 5644800,

  /** 11289.6Khz: 4 x SACD, 256 x Audio CD */
  sacd4x: 11289600,

  /** 22579.2Khz: 8 x SACD, 512 x Audio CD */
  sacd8x: 22579200,
} as const

export type CommonSampleRate = keyof typeof COMMON_SAMPLE_RATES

const DEFAULT_RATE = COMMON_SAMPLE_RATES.standard

export const resolveSampleRate = (sampleRate: number | CommonSampleRate) => {
  let rate =
    typeof sampleRate === "number"
      ? sampleRate
      : COMMON_SAMPLE_RATES[sampleRate]
  if (!rate || rate <= 0) {
    logger.warn(
      new Error(
        `Invalid sample rate: ${sampleRate} (defaulting to ${DEFAULT_RATE})`
      )
    )
    rate = DEFAULT_RATE
  }
  return rate
}

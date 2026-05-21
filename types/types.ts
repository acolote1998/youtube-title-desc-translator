export type YoutubeTranslation = {
    languageInYoutube:
    string
    translatedTitle: string;
    translatedDescription: string;
};
export type VideoData = {
    link: string
    videoName: string
    releaseDate: string
}

export type ProcessingType = "TRANSLATION" | "HASHTAG_SHUFFLE"
export const RatingLevels = {
    star_1: 2,
    star_1_5: 3,
    star_2: 4,
    star_2_5: 5,
    star_3: 6
}

export function getRatingLevel(ratingInPercent){
    if (ratingInPercent >= 85) return RatingLevels.star_3
    else if (ratingInPercent >= 70) return RatingLevels.star_2_5
    else if (ratingInPercent >= 55) return RatingLevels.star_2
    else if (ratingInPercent >= 45) return RatingLevels.star_1_5
    else return RatingLevels.star_1
}
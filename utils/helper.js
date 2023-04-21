export const getDiscountedPricePercentage = (originalPrice, discountedPrice) => {

    const dicountPercentage = ((originalPrice-discountedPrice)/originalPrice)*100;

    return dicountPercentage.toFixed(2);
}
export function calculateDiscount(cartItems, type, num, userPoints = 0) {
    const originalTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    let discount = 0;
    let discountCoupon = 0;

    const accessoriesItems = cartItems.filter(item => item.category === 'Accessories');
    const accessoriesQuantity = accessoriesItems.reduce((sum, item) => sum + item.quantity, 0);

    if (accessoriesQuantity >= 3) {
        discount += 20;
    }

    if (type == 'percent') {
        discountCoupon = (originalTotal * num) / 100;
    } else {
        discountCoupon = num;
    }

    discount += discountCoupon;
  

    const maxPointDiscount = originalTotal;
    const pointDiscount = Math.min(userPoints, maxPointDiscount);
    discount += pointDiscount;
  
  
    const finalTotal = Math.max(originalTotal - discount, 0);
    const additionalDiscount = Math.floor(finalTotal / 250) * 10;
    const finalDiscountedTotal = Math.max(finalTotal - additionalDiscount, 0);

    return {
        originalTotal,
        discountDetails: {
            couponDiscount: discountCoupon,
            pointDiscount,
            accessoriesDiscount: (accessoriesQuantity >= 3 ? 20 : 0),
            additionalDiscount: additionalDiscount,
            finalTotal
        },
        finalTotal: finalDiscountedTotal
    };
}

  
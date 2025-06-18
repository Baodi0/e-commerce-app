function submitReview(e) {
      e.preventDefault();
      const rating = document.getElementById('rating').value;
      const comment = document.getElementById('comment').value;

      if (rating && comment) {
        alert(`Cảm ơn bạn đã đánh giá với ${rating} sao: \n\n"${comment}"`);
        location.href = "/e-commerce-app/public/order-list";
      }
    }
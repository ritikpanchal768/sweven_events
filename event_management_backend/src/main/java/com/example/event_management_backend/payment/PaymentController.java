package com.example.event_management_backend.payment;

import com.example.event_management_backend.booking.dto.Booking;
import com.example.event_management_backend.db.DbUtils;
import com.razorpay.Utils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/v1/payment")
public class PaymentController {

    private final RazorpayService razorpayService;
    private final DbUtils dbUtils;

    @Value("${razorpay.keyId}")
    private String keyId;

    @Value("${razorpay.keySecret}")
    private String keySecret;

    public PaymentController(RazorpayService razorpayService, DbUtils dbUtils) {
        this.razorpayService = razorpayService;
        this.dbUtils = dbUtils;
    }

    @PostMapping("/create-order")
    public String createOrder(@RequestBody Map<String, Object> request) throws Exception {

        String bookingIdStr = (String) request.get("bookingId");
        UUID bookingId = UUID.fromString(bookingIdStr);

        Booking booking = dbUtils.returnedAsObject(
                "select * from booking where id = ?",
                Booking.class,
                bookingId
        );

        if (booking == null) {
            throw new RuntimeException("Booking not found");
        }

        BigDecimal amount = booking.getTotalamount();

        return razorpayService.createOrder(amount.doubleValue(), bookingIdStr);
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verifyPayment(@RequestBody Map<String, String> response) throws Exception {

        String bookingIdStr = response.get("bookingId");
        String orderId = response.get("razorpayOrderId");
        String paymentId = response.get("razorpayPaymentId");
        String signature = response.get("razorpaySignature");

        if (bookingIdStr == null || orderId == null || paymentId == null || signature == null) {
            return ResponseEntity.badRequest().body("Missing payment details");
        }

        UUID bookingId = UUID.fromString(bookingIdStr);

        String generatedSignature =
                Utils.getHash(orderId + "|" + paymentId, keySecret);

        if (generatedSignature.equals(signature)) {

            dbUtils.executeUpdate(
                    "UPDATE booking SET status = 'CONFIRMED' WHERE id = ?",
                    bookingId
            );

            return ResponseEntity.ok("Payment verified");
        }

        return ResponseEntity.status(400).body("Invalid signature");
    }
}

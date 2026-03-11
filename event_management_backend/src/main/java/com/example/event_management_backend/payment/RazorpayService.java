package com.example.event_management_backend.payment;

import com.razorpay.*;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class RazorpayService {

    @Value("${razorpay.keyId}")
    private String keyId;

    @Value("${razorpay.keySecret}")
    private String keySecret;

    public String createOrder(Double amount, String bookingId) throws Exception {

        RazorpayClient razorpay = new RazorpayClient(keyId, keySecret);

        JSONObject options = new JSONObject();
        options.put("amount", (int)(amount * 100)); // amount in paisa
        options.put("currency", "INR");
        options.put("receipt", bookingId);

        Order order = razorpay.orders.create(options);

        return order.toString();
    }
}

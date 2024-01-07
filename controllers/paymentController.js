import braintree from "braintree";
import dotenv from "dotenv";
import orderModel from "../models/orderModel.js";
//PAYMENT GETEWAY

var gateway = new braintree.BraintreeGateway({
    environment: braintree.Environment.Sandbox,
    merchantId: process.env.BRAINTREE_MEARCHANT_ID,
    publicKey: process.env.BRAINTREE_PUBLIC_KEY,
    privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});
export const braintreeToken = async (req, res) => {
    try {
        gateway.clientToken.generate({}, function (err, response) {
            if (err) {
                res.status(500).send(err)
            }
            else {
                res.status(200).send(response)
            }
        })
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Error While setting token",
            error
        })
    }
}


//PAYMENTS
export const braintreePayment = async (req, res) => {
    try {
        const { nonce, items } = req.body;
        console.log("nonce", nonce)
        let total = 0;
        items.map((i) => {
            total += i.price;
        });
        let newTransaction = gateway.transaction.sale(
            {
                amount: total,
                paymentMethodNonce: nonce,
                options: {
                    submitForSettlement: true,
                },
            },
            function (error, result) {
                if (result) {
                    const order = new orderModel({
                        products: items,
                        payment: result,
                        buyer: req.user._id,
                    }).save();
                    res.json({ ok: true });
                } else {
                    res.status(500).send(error);
                }
            }
        );
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Error While Payments",
            error
        })
    }
}

export const getPaymentByMonthly = async (req, res) => {
    try {
        const { year, month } = req.params;
        console.log("year", year);
        console.log("month", month);
        const startOfMonth = new Date(year, month - 1, 1);
        const endOfMenth = new Date(year, month, 0);

        const orders = await orderModel.find({ createdAt: { $gte: startOfMonth, $lt: endOfMenth } });
        res.status(200).json({
            success: true,
            message: "Fetched Successfully",
            orders
        })
    } catch (error) {
        res.status(501).json({
            success: false,
            message: "Failed to Fetched",
            error
        })
    }
}
export const getAllPayments = async (req, res) => {
    try {
        const { count, skip } = req.query;

        const searchResults = await braintree.transaction.search((search) => {
            search.setPageSize(count ? parseInt(count) : 10);
            search.setPage(skip ? parseInt(skip) : 1);
            search.status().is("settled");
        });


        const allPayments = searchResults.map((transaction) => {
            return {
                start_at: transaction.createdAt,
            };
        });

        const monthNames = [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December',
        ];

        const finalMonths = {
            January: 0,
            February: 0,
            March: 0,
            April: 0,
            May: 0,
            June: 0,
            July: 0,
            August: 0,
            September: 0,
            October: 0,
            November: 0,
            December: 0,
        };

        const monthlyWisePayments = allPayments.map((payment) => {
            const monthsInNumbers = new Date(payment.start_at);

            return monthNames[monthsInNumbers.getMonth()];
        });

        monthlyWisePayments.forEach((month) => {
            if (finalMonths.hasOwnProperty(month)) {
                finalMonths[month] += 1;
            }
        });

        const monthlySalesRecord = Object.values(finalMonths);

        res.status(200).json({
            success: true,
            message: 'All payments',
            allPayments,
            finalMonths,
            monthlySalesRecord,
        });
    } catch (error) {
        console.error('Error fetching payments:', error.message);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};


namespace Application.Commons.DTOs
{
    public class CreatePaymentRequest
    {

        public string UserId { get; set; }
        public int Amount { get; set; }
        public string ItemName { get; set; }
        public string Description { get; set; }
        public int PaymentDate { get; set; }

    }
}

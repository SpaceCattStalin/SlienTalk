using Domain.Entities;
using Domain.Enums;
using Microsoft.VisualStudio.Web.CodeGenerators.Mvc.Templates.BlazorIdentity.Pages.Manage;
using System.ComponentModel;

namespace API.DTOs
{
    public class AdminPaymentFilterRequest
    {
        public string? Keyword { get; set; }
        public string? Email { get; set; }
        public int? PaymentDate { get; set; } // Unix timestamp

        public PaymentStatus Status { get; set; } = 0; // Pending, Paid, Failed, Refunded

        public string? SortBy { get; set; }
        // Paging
        [DefaultValue(1)]
        public int CurrentPage { get; set; } = 1;
        [DefaultValue(10)]
        public int PageSize { get; set; } = 10;
    }

    public class AdminPaymentReponseRequest
    {
        public string? Email { get; set; }
        public int? PaymentDate { get; set; } // Unix timestamp

        public PaymentStatus Status { get; set; } = 0; // Pending, Paid, Failed, Refunded
    }
}

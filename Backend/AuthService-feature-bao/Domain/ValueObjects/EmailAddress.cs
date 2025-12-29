using FluentResults;
using System.Text.RegularExpressions;

namespace Domain.ValueObjects
{
    public class EmailAddress
    {
        public string Value { get; }

        private EmailAddress(string value)
        {
            Value = value;
        }

        public static Result<EmailAddress> Create(string email)
        {
            if (string.IsNullOrEmpty(email))
            {
                return Result.Fail<EmailAddress>("Email address cannot be null or empty.");
                //.WithError(new Error("InvalidEmailAddress"));
            }

            if (!Regex.IsMatch(email, @"^[^@\s]+@[^@\s]+\.[^@\s]+$"))
            {
                return Result.Fail<EmailAddress>("Email format is invalid.");
                //.WithError(new Error("InvalidEmailFormat"));
            }

            return Result.Ok(new EmailAddress(email));
        }


        public override string ToString()
        {
            return Value;
        }

        public override bool Equals(object obj)
        {
            return obj is EmailAddress other && Value == other.Value;
        }
        public override int GetHashCode()
        {
            return Value.GetHashCode();
        }
    }
}

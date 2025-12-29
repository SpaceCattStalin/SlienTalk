using Domain.ValueObjects;
using FluentResults;
using System.Text.RegularExpressions;

public class Password
{
    public string Value { get; }

    private Password(string hashedValue)
    {
        Value = hashedValue;
    }
    public static Result<Password> Create(string password)
    {
        if (string.IsNullOrWhiteSpace(password))
        {
            return Result.Fail<Password>("Password cannot be null or empty")
                .WithError(new Error("InvalidPassword"));
        }

        return Result.Ok(new Password(password));
    }
    public override string ToString()
    {
        return Value;
    }

    public override bool Equals(object obj)
    {
        return obj is Password other && Value == other.Value;
    }
    public override int GetHashCode()
    {
        return Value.GetHashCode();
    }
}

using Domain.ValueObjects;
using System.ComponentModel.DataAnnotations;

public class LoginRequest
{
    public string Email { get; set; } = default!;

    public string Password { get; set; } = default!;
}
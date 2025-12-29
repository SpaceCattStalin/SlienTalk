namespace Application.Commons.Interfaces.Services
{
    public interface ISocialAuthFactory
    {
        IExternalAuthService Get(string provider);
    }
}

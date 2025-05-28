using System;
using System.Net;
using System.Net.Mail;
public interface IEmailService
{
    void SendHtmlEmail(Patient patient);
}//cba putting it in a different file

public class EmailService : IEmailService
{

    private readonly IConfiguration _config;//need this to get access to appsettings.json

    public EmailService(IConfiguration config)
    {
        _config = config;
    }

    public void SendHtmlEmail(Patient patient)
    {
        try
        {
            var email = _config["EmailSettings:Sender"];
            var password = _config["EmailSettings:Password"];
            if (email == null || password == null)
            {
                throw new Exception($"unable to get details from appsettings. check debugger for the values for email and password");
            }
            SmtpClient smtp = new SmtpClient("smtp.gmail.com", 587);
            smtp.Credentials = new NetworkCredential(email, password);
            smtp.EnableSsl = true;
            MailMessage mail = new MailMessage();
            mail.From = new MailAddress(email);
            mail.Subject = "Repeat prescription request";
            mail.IsBodyHtml = true;
            mail.Body = $@"
                <html>
                    <body style=""font-family: Arial, sans-serif; color: #333; line-height: 1.5; margin: 0; padding: 20px;"">
                        <h1 style=""color: #2a7ae2;"">Order for Repeat Medication</h1>
                        <p>We would like to order repeat medication on behalf of a mutual patient.</p>
                        <hr style=""border: none; border-top: 1px solid #ddd; margin: 20px 0;"" />
                        <p><strong>Patient Name:</strong> {patient.FirstName} {patient.Surname}</p>
                        <p><strong>Date of Birth:</strong> {patient.DOB}</p>
                        <p><strong>Address:</strong> {patient.Address}</p>
                        <hr style=""border: none; border-top: 1px solid #ddd; margin: 20px 0;"" />
                        <p><strong>Medication Requested:</strong></p>
                        <!-- Add your medication details here -->
                    </body>
                </html>";
            mail.To.Add("moakbar202@gmail.com");//this would be the gp's email, however this is for tessing purposes 
            smtp.Send(mail);
        }
        catch (Exception error)
        {
            Console.WriteLine(error); // Temporary, better to use a logging framework
            throw;
        }
    }

    private string createMedicationList(Patient patient)
    {
        
    }
}
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
public static class UserEndpoints
{
    public static void MapUserEndpoints(this IEndpointRouteBuilder routes)

    {
        routes.MapGet("/users", async (IUserService _userService) =>
        {
            try
            {
                var users = await _userService.Get();
                if (users == null || !users.Any())
                {
                    return Results.NotFound();
                }
                else
                {

                    return Results.Ok(users);
                }
            }
            catch (Exception error)
            {
                return Results.BadRequest(error);
            }
        });

        routes.MapPost("/login", async (HttpContext context, User user, IUserService _userService, IConfiguration _configuration) =>
        {
            try
            {
                if (user == null || string.IsNullOrWhiteSpace(user.Email) || string.IsNullOrWhiteSpace(user.Password))
                {
                    return Results.BadRequest("Email and password are required.");
                }

                var userToCheck = await _userService.GetByEmail(user.Email);
                if (userToCheck == null)
                {
                    return Results.Unauthorized();
                }

                bool isValid = BCrypt.Net.BCrypt.Verify(user.Password, userToCheck.Password);
                if (!isValid)
                {
                    return Results.Unauthorized();
                }

                string token = CreateToken(userToCheck, _configuration);
                var cookieOptions = new CookieOptions
                {
                    SameSite = SameSiteMode.None,
                    HttpOnly = true,
                    Secure = true,
                    Expires = DateTime.UtcNow.AddDays(7)
                };

                context.Response.Cookies.Append("token", token, cookieOptions);

                return Results.Ok(new { message = "Login successful." });
            }
            catch (Exception error)
            {
                return Results.BadRequest(new { message = error.Message });
            }

        });

        routes.MapPost("/register", async (User user, IUserService _userService) =>
        {
            if (user == null)
            {
                return Results.BadRequest("User is null");
            }
            if (string.IsNullOrEmpty(user.Email))
            {
                return Results.BadRequest("email is null");
            }
            if (string.IsNullOrEmpty(user.Password))
            {
                return Results.BadRequest("password is null");
            }
            // Check for existing user before creating
            if (await _userService.GetByEmail(user.Email) != null)
            {
                return Results.Conflict("a user with either the same email already exists");
            }
            user.Password = BCrypt.Net.BCrypt.HashPassword(user.Password, workFactor: 10);
            await _userService.Create(user);
            return Results.Created($"/users/{user.Id}", user);
        });


        routes.MapGet("/auth/check", async (HttpContext context, IUserService _userService, IConfiguration _configuration) =>
        {
            try
            {
                var token = context.Request.Cookies["token"];
                if (string.IsNullOrEmpty(token))
                    return Results.Unauthorized();

                var user = await ValidateTokenAsync(token, _userService, _configuration);
                if (user is null)
                    return Results.Unauthorized();

                return Results.Ok(new { authenticated = true, user = new { user.Id, user.Email } });
            }
            catch
            {
                return Results.Unauthorized();
            }
        });
        
        routes.MapPost("/logout", (HttpResponse response) =>
        {
            response.Cookies.Append("token", "", new CookieOptions
            {
                HttpOnly = true,
                Secure = true,        
                SameSite = SameSiteMode.Strict,
                Expires = DateTimeOffset.UnixEpoch, 
                Path = "/"
            });
            return Results.Ok(new { message = "Logged out" });
        });


    }

    
    private static string CreateToken(User user, IConfiguration _configuration)
    {
        List<Claim> claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier,user.Id.ToString()),
            new Claim(ClaimTypes.Email, user.Email)
        };//basically a js object
        var key = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(_configuration.GetSection("AppSettings:Token").Value));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);
        var token = new JwtSecurityToken(
            claims: claims,
            expires: DateTime.Now.AddMinutes(45),
            signingCredentials: creds
        );
        var jwt = new JwtSecurityTokenHandler().WriteToken(token);
        return jwt;
    }
    

        private static async Task<User?> ValidateTokenAsync(string token, IUserService userService, IConfiguration configuration)
    {
        if (string.IsNullOrEmpty(token))
            return null;

        try
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = System.Text.Encoding.UTF8.GetBytes(configuration["AppSettings:Token"]!);
            var validationParameters = new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(key),
                ValidateIssuer = false,
                ValidateAudience = false,
                ClockSkew = TimeSpan.Zero
            };

            var principal = tokenHandler.ValidateToken(token, validationParameters, out var validatedToken);

            if (validatedToken is JwtSecurityToken jwtToken &&
                !jwtToken.Header.Alg.Equals(SecurityAlgorithms.HmacSha512Signature, StringComparison.InvariantCultureIgnoreCase))
            {
                return null;
            }

            var userIdClaim = principal.FindFirst(JwtRegisteredClaimNames.Sub)?.Value
                              ?? principal.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out var userId))
                return null;

            return await userService.GetById(userId);
        }
        catch
        {
            return null;
        }
    }
    
    
}
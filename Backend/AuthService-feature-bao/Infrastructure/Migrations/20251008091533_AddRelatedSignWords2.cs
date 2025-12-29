using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddRelatedSignWords2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "RelatedSignWords",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    SignWordId = table.Column<string>(type: "nvarchar(50)", nullable: false),
                    RelatedSignWordId = table.Column<string>(type: "nvarchar(50)", nullable: false),
                    RelationType = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Notes = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RelatedSignWords", x => x.Id);
                    table.ForeignKey(
                        name: "FK_RelatedSignWords_SignWord_RelatedSignWordId",
                        column: x => x.RelatedSignWordId,
                        principalTable: "SignWord",
                        principalColumn: "SignWordId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_RelatedSignWords_SignWord_SignWordId",
                        column: x => x.SignWordId,
                        principalTable: "SignWord",
                        principalColumn: "SignWordId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_RelatedSignWords_RelatedSignWordId",
                table: "RelatedSignWords",
                column: "RelatedSignWordId");

            migrationBuilder.CreateIndex(
                name: "IX_RelatedSignWords_SignWordId",
                table: "RelatedSignWords",
                column: "SignWordId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "RelatedSignWords");
        }
    }
}

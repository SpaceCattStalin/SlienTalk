using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddSignWordCollections : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "SignWord",
                columns: table => new
                {
                    SignWordId = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Word = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    Category = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    Definition = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    WordType = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    SignWordUri = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    ExampleSentence = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    ExampleSentenceVideoUri = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SignWord", x => x.SignWordId);
                });

            migrationBuilder.CreateTable(
                name: "SignWordCollection",
                columns: table => new
                {
                    CollectionId = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    CreatedBy = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    Name = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    CreatedAt = table.Column<int>(type: "int", nullable: true),
                    UpdatedAt = table.Column<int>(type: "int", nullable: true),
                    IsDefault = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SignWordCollection", x => x.CollectionId);
                });

            migrationBuilder.CreateTable(
                name: "SignWordCollection_SignWord",
                columns: table => new
                {
                    CollectionId = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    SignWordId = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    AddedAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SignWordCollection_SignWord", x => new { x.CollectionId, x.SignWordId });
                    table.ForeignKey(
                        name: "FK_SignWordCollection_SignWord_SignWordCollection_CollectionId",
                        column: x => x.CollectionId,
                        principalTable: "SignWordCollection",
                        principalColumn: "CollectionId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_SignWordCollection_SignWord_SignWord_SignWordId",
                        column: x => x.SignWordId,
                        principalTable: "SignWord",
                        principalColumn: "SignWordId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_SignWordCollection_SignWord_SignWordId",
                table: "SignWordCollection_SignWord",
                column: "SignWordId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "SignWordCollection_SignWord");

            migrationBuilder.DropTable(
                name: "SignWordCollection");

            migrationBuilder.DropTable(
                name: "SignWord");
        }
    }
}

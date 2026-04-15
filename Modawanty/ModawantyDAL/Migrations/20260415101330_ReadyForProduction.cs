using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace ModawantyDAL.Migrations
{
    /// <inheritdoc />
    public partial class ReadyForProduction : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "ArticleTags",
                keyColumns: new[] { "ArticleId", "TagId" },
                keyValues: new object[] { 1, 13 });

            migrationBuilder.DeleteData(
                table: "ArticleTags",
                keyColumns: new[] { "ArticleId", "TagId" },
                keyValues: new object[] { 1, 14 });

            migrationBuilder.DeleteData(
                table: "ArticleTags",
                keyColumns: new[] { "ArticleId", "TagId" },
                keyValues: new object[] { 1, 15 });

            migrationBuilder.DeleteData(
                table: "ArticleTags",
                keyColumns: new[] { "ArticleId", "TagId" },
                keyValues: new object[] { 2, 13 });

            migrationBuilder.DeleteData(
                table: "ArticleTags",
                keyColumns: new[] { "ArticleId", "TagId" },
                keyValues: new object[] { 2, 14 });

            migrationBuilder.DeleteData(
                table: "ArticleTags",
                keyColumns: new[] { "ArticleId", "TagId" },
                keyValues: new object[] { 2, 15 });

            migrationBuilder.DeleteData(
                table: "ArticleTags",
                keyColumns: new[] { "ArticleId", "TagId" },
                keyValues: new object[] { 3, 8 });

            migrationBuilder.DeleteData(
                table: "ArticleTags",
                keyColumns: new[] { "ArticleId", "TagId" },
                keyValues: new object[] { 3, 14 });

            migrationBuilder.DeleteData(
                table: "ArticleTags",
                keyColumns: new[] { "ArticleId", "TagId" },
                keyValues: new object[] { 3, 15 });

            migrationBuilder.DeleteData(
                table: "ArticleTags",
                keyColumns: new[] { "ArticleId", "TagId" },
                keyValues: new object[] { 4, 10 });

            migrationBuilder.DeleteData(
                table: "ArticleTags",
                keyColumns: new[] { "ArticleId", "TagId" },
                keyValues: new object[] { 4, 13 });

            migrationBuilder.DeleteData(
                table: "ArticleTags",
                keyColumns: new[] { "ArticleId", "TagId" },
                keyValues: new object[] { 4, 14 });

            migrationBuilder.DeleteData(
                table: "ArticleTags",
                keyColumns: new[] { "ArticleId", "TagId" },
                keyValues: new object[] { 5, 13 });

            migrationBuilder.DeleteData(
                table: "ArticleTags",
                keyColumns: new[] { "ArticleId", "TagId" },
                keyValues: new object[] { 5, 14 });

            migrationBuilder.DeleteData(
                table: "ArticleTags",
                keyColumns: new[] { "ArticleId", "TagId" },
                keyValues: new object[] { 5, 15 });

            migrationBuilder.DeleteData(
                table: "ArticleTags",
                keyColumns: new[] { "ArticleId", "TagId" },
                keyValues: new object[] { 6, 8 });

            migrationBuilder.DeleteData(
                table: "ArticleTags",
                keyColumns: new[] { "ArticleId", "TagId" },
                keyValues: new object[] { 6, 14 });

            migrationBuilder.DeleteData(
                table: "ArticleTags",
                keyColumns: new[] { "ArticleId", "TagId" },
                keyValues: new object[] { 6, 15 });

            migrationBuilder.DeleteData(
                table: "ArticleTags",
                keyColumns: new[] { "ArticleId", "TagId" },
                keyValues: new object[] { 7, 13 });

            migrationBuilder.DeleteData(
                table: "ArticleTags",
                keyColumns: new[] { "ArticleId", "TagId" },
                keyValues: new object[] { 7, 14 });

            migrationBuilder.DeleteData(
                table: "ArticleTags",
                keyColumns: new[] { "ArticleId", "TagId" },
                keyValues: new object[] { 7, 15 });

            migrationBuilder.DeleteData(
                table: "ArticleTags",
                keyColumns: new[] { "ArticleId", "TagId" },
                keyValues: new object[] { 8, 10 });

            migrationBuilder.DeleteData(
                table: "ArticleTags",
                keyColumns: new[] { "ArticleId", "TagId" },
                keyValues: new object[] { 8, 13 });

            migrationBuilder.DeleteData(
                table: "ArticleTags",
                keyColumns: new[] { "ArticleId", "TagId" },
                keyValues: new object[] { 8, 14 });

            migrationBuilder.DeleteData(
                table: "ArticleTags",
                keyColumns: new[] { "ArticleId", "TagId" },
                keyValues: new object[] { 9, 8 });

            migrationBuilder.DeleteData(
                table: "ArticleTags",
                keyColumns: new[] { "ArticleId", "TagId" },
                keyValues: new object[] { 9, 14 });

            migrationBuilder.DeleteData(
                table: "ArticleTags",
                keyColumns: new[] { "ArticleId", "TagId" },
                keyValues: new object[] { 9, 15 });

            migrationBuilder.DeleteData(
                table: "ArticleTags",
                keyColumns: new[] { "ArticleId", "TagId" },
                keyValues: new object[] { 10, 13 });

            migrationBuilder.DeleteData(
                table: "ArticleTags",
                keyColumns: new[] { "ArticleId", "TagId" },
                keyValues: new object[] { 10, 14 });

            migrationBuilder.DeleteData(
                table: "ArticleTags",
                keyColumns: new[] { "ArticleId", "TagId" },
                keyValues: new object[] { 10, 15 });

            migrationBuilder.DeleteData(
                table: "Books",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Books",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "Books",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "Books",
                keyColumn: "Id",
                keyValue: 4);

            migrationBuilder.DeleteData(
                table: "Books",
                keyColumn: "Id",
                keyValue: 5);

            migrationBuilder.DeleteData(
                table: "Books",
                keyColumn: "Id",
                keyValue: 6);

            migrationBuilder.DeleteData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: 4);

            migrationBuilder.DeleteData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: 6);

            migrationBuilder.DeleteData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: 7);

            migrationBuilder.DeleteData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: 8);

            migrationBuilder.DeleteData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: 9);

            migrationBuilder.DeleteData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: 10);

            migrationBuilder.DeleteData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: 11);

            migrationBuilder.DeleteData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: 12);

            migrationBuilder.DeleteData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: 15);

            migrationBuilder.DeleteData(
                table: "Tags",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Tags",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "Tags",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "Tags",
                keyColumn: "Id",
                keyValue: 4);

            migrationBuilder.DeleteData(
                table: "Tags",
                keyColumn: "Id",
                keyValue: 5);

            migrationBuilder.DeleteData(
                table: "Tags",
                keyColumn: "Id",
                keyValue: 6);

            migrationBuilder.DeleteData(
                table: "Tags",
                keyColumn: "Id",
                keyValue: 7);

            migrationBuilder.DeleteData(
                table: "Tags",
                keyColumn: "Id",
                keyValue: 9);

            migrationBuilder.DeleteData(
                table: "Tags",
                keyColumn: "Id",
                keyValue: 11);

            migrationBuilder.DeleteData(
                table: "Tags",
                keyColumn: "Id",
                keyValue: 12);

            migrationBuilder.DeleteData(
                table: "Articles",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Articles",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "Articles",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "Articles",
                keyColumn: "Id",
                keyValue: 4);

            migrationBuilder.DeleteData(
                table: "Articles",
                keyColumn: "Id",
                keyValue: 5);

            migrationBuilder.DeleteData(
                table: "Articles",
                keyColumn: "Id",
                keyValue: 6);

            migrationBuilder.DeleteData(
                table: "Articles",
                keyColumn: "Id",
                keyValue: 7);

            migrationBuilder.DeleteData(
                table: "Articles",
                keyColumn: "Id",
                keyValue: 8);

            migrationBuilder.DeleteData(
                table: "Articles",
                keyColumn: "Id",
                keyValue: 9);

            migrationBuilder.DeleteData(
                table: "Articles",
                keyColumn: "Id",
                keyValue: 10);

            migrationBuilder.DeleteData(
                table: "Tags",
                keyColumn: "Id",
                keyValue: 8);

            migrationBuilder.DeleteData(
                table: "Tags",
                keyColumn: "Id",
                keyValue: 10);

            migrationBuilder.DeleteData(
                table: "Tags",
                keyColumn: "Id",
                keyValue: 13);

            migrationBuilder.DeleteData(
                table: "Tags",
                keyColumn: "Id",
                keyValue: 14);

            migrationBuilder.DeleteData(
                table: "Tags",
                keyColumn: "Id",
                keyValue: 15);

            migrationBuilder.DeleteData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: 5);

            migrationBuilder.DeleteData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: 13);

            migrationBuilder.DeleteData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: 14);

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "019a0ee5-cea2-7ffa-abcd-27d88ee5d222",
                columns: new[] { "Email", "FirstName", "LastName", "NormalizedEmail", "NormalizedUserName", "UserName" },
                values: new object[] { "tareekhalshoob@gmail.com", "moaz", "", "TAREEKHALSHOOB@GMAIL.COM", "MOAZ25", "moaz25" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "019a0ee5-cea2-7ffa-abcd-27d88ee5d222",
                columns: new[] { "Email", "FirstName", "LastName", "NormalizedEmail", "NormalizedUserName", "UserName" },
                values: new object[] { "Admin25@gmail.com", "System", "Admin", "admin25@gmail.com", "admin25", "Admin25" });

            migrationBuilder.InsertData(
                table: "Books",
                columns: new[] { "Id", "About", "Author", "CreatedAt", "DownloadLink", "PageCount", "Poster", "ReleaseDate", "SaveLocation", "Title" },
                values: new object[,]
                {
                    { 1, "Even bad code can function. But if code isn't clean, it can bring a development organization to its knees. Every year, countless hours and significant resources are spent fixing fragile and broken code. But it doesn't have to be that way.", "Robert C. Martin", new DateTime(2024, 1, 15, 10, 30, 0, 0, DateTimeKind.Utc), "uploading", 464, "https://covers.openlibrary.org/b/isbn/9780132350884-M.jpg", new DateOnly(2008, 8, 1), "pending_upload", "Clean Code: A Handbook of Agile Software Craftsmanship" },
                    { 2, "The Pragmatic Programmer is about taking charge of your career. Be pragmatic. Make choices based on analysis and commonsense. Look at the state of the art, but also consider your own needs.", "David Thomas, Andrew Hunt", new DateTime(2024, 1, 18, 14, 45, 0, 0, DateTimeKind.Utc), "uploading", 352, "https://covers.openlibrary.org/b/isbn/9780135957059-M.jpg", new DateOnly(2019, 10, 1), "pending_upload", "The Pragmatic Programmer: Your Journey to Mastery" },
                    { 3, "Capturing a wealth of experience about the design of object-oriented software, four top-notch designers present a catalog of simple and elegant solutions to commonly occurring design problems.", "Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides", new DateTime(2024, 1, 20, 9, 15, 0, 0, DateTimeKind.Utc), "uploading", 395, "https://covers.openlibrary.org/b/isbn/9780201633610-M.jpg", new DateOnly(1994, 10, 31), "pending_upload", "Design Patterns: Elements of Reusable Object-Oriented Software" },
                    { 4, "Some books on algorithms are written to teach students. Some are written as reference material. Introduction to Algorithms was conceived as a comprehensive textbook covering the full scope of computer algorithms.", "Thomas H. Cormen, Charles E. Leiserson, Ronald L. Rivest, Clifford Stein", new DateTime(2024, 1, 22, 16, 20, 0, 0, DateTimeKind.Utc), "uploading", 1312, "https://covers.openlibrary.org/b/isbn/9780262033848-M.jpg", new DateOnly(2009, 7, 31), "pending_upload", "Introduction to Algorithms" },
                    { 5, "The You Don't Know JS Yet book series is aimed at everyone seeking to learn and deepen their understanding of the JavaScript programming language. Everyone starts somewhere.", "Kyle Simpson", new DateTime(2024, 1, 25, 11, 50, 0, 0, DateTimeKind.Utc), "uploading", 432, "https://covers.openlibrary.org/b/isbn/9781492091523-M.jpg", new DateOnly(2020, 1, 28), "pending_upload", "You Don't Know JS Yet" },
                    { 6, "These seminal works are an essential resource in the personal library of any serious programmer. Countless readers have spoken about the profound personal impact of Knuth's work.", "Donald E. Knuth", new DateTime(2024, 1, 28, 13, 30, 0, 0, DateTimeKind.Utc), "uploading", 883, "https://covers.openlibrary.org/b/isbn/9780201896830-M.jpg", new DateOnly(1997, 6, 15), "pending_upload", "The Art of Computer Programming" }
                });

            migrationBuilder.InsertData(
                table: "Categories",
                columns: new[] { "Id", "IsAvailable", "Name" },
                values: new object[,]
                {
                    { 1, true, "تكنولوجيا" },
                    { 2, true, "العلوم" },
                    { 3, true, "الأعمال" },
                    { 4, true, "الصحة" },
                    { 5, true, "التعليم" },
                    { 6, true, "الرياضة" },
                    { 7, true, "الترفيه" },
                    { 8, true, "السفر" },
                    { 9, true, "الطعام" },
                    { 10, true, "الموضة" },
                    { 11, true, "نمط الحياة" },
                    { 12, true, "السياسة" },
                    { 13, true, "الثقافة" },
                    { 14, true, "البيئة" },
                    { 15, true, "الابتكار" }
                });

            migrationBuilder.InsertData(
                table: "Tags",
                columns: new[] { "Id", "IsAvailable", "Name" },
                values: new object[,]
                {
                    { 1, true, "برمجة" },
                    { 2, true, "تصميم" },
                    { 3, true, "تسويق" },
                    { 4, true, "إدارة" },
                    { 5, true, "استثمار" },
                    { 6, true, "ريادة الأعمال" },
                    { 7, true, "تدريب" },
                    { 8, true, "مهارات" },
                    { 9, true, "قيادة" },
                    { 10, true, "ابتكار" },
                    { 11, true, "استراتيجية" },
                    { 12, true, "تطوير" },
                    { 13, true, "تحليل" },
                    { 14, true, "بحث" },
                    { 15, true, "توعية" }
                });

            migrationBuilder.InsertData(
                table: "Articles",
                columns: new[] { "Id", "ArticleViews", "AuthorId", "AuthorName", "CategoryId", "Content", "CreatedAt", "FeaturedImageUrl", "IsDeleted", "IsPublished", "ReadTimeInMiniutes", "Title", "UpdatedAt" },
                values: new object[,]
                {
                    { 1, null, null, "د. عمر القاسم", 13, "كيف يمكن استعادة المعنى والحرفية في ظل الثورة الرقمية التي نعيشها اليوم. في عصر التكنولوجيا السريعة والأتمتة، أصبحت القيمة الحقيقية للحرفة والعمل اليدوي والإتقان أكثر أهمية من أي وقت مضى.\r\n\r\nالحرفة ليست مجرد مهارة يدوية، بل هي فلسفة حياة قائمة على الالتزام بالتميز والجودة. في العصور القديمة، كان الحرفيون يكرسون حياتهم لإتقان فنونهم، وكانوا يفخرون بما ينتجونه. كل قطعة كانت انعكاساً لروحهم وقيمهم.\r\n\r\nلكن مع ظهور الثورة الصناعية، تحول التركيز من الجودة إلى الكمية. الإنتاج الضخم والاستهلاك السريع أصبح هو المعيار. ومع الثورة الرقمية، زاد هذا التوجه أكثر فأكثر. كل شيء أصبح سريعاً وسطحياً ومؤقتاً.\r\n\r\nلكن هناك استيقاظ متزايد نحو قيمة الحرفة الحقيقية. الناس بدأوا يدركون أن السعادة الحقيقية لا تأتي من امتلاك أشياء كثيرة، بل من امتلاك أشياء ذات قيمة حقيقية. الحرفة اليدوية، الاهتمام بالتفاصيل، والإتقان أصبحوا يحظون بتقدير متجدد.\r\n\r\nالحرفيون المعاصرون يجمعون بين المهارات القديمة والأدوات الحديثة. إنهم يستخدمون التكنولوجيا ليس لاستبدال الحرفة، بل لتحسينها وتطويرها. هذا التوازن بين القديم والحديث هو ما يعطي المعنى الحقيقي للعمل.\r\n\r\nاستعادة فلسفة الحرفة تتطلب تغييراً في منظورنا. نحتاج إلى تقدير الوقت والجهد المستثمر في أي عمل. نحتاج إلى فهم أن الجودة تتطلب صبراً وإصراراً. نحتاج إلى استعادة الفخر بما ننتجه، سواء كان مادياً أو فكرياً.\r\n\r\nفي العصر الرقمي، يمكن أن تكون الحرفة موجودة في كل مكان: في الكتابة، في البرمجة، في التصميم، في التعليم. أينما كان هناك التزام بالتميز والجودة، هناك توجد الحرفة. هذه هي الطريقة لاستعادة المعنى في عصرنا الرقمي.", new DateTime(2024, 5, 15, 0, 0, 0, 0, DateTimeKind.Utc), "https://lh3.googleusercontent.com/aida-public/AB6AXuACPRZ9fApQxZLggAWFDuWdIJgqrOMNi9sX5KjHSryiEVOYJ3hUkxRNMK4Aa9puI9is71mYzAWUKRhGZaEkYfXJ6ggSMIAD5u1van0tTGGdnowpa1ZQtlaZ7Ci7czmhyX_Mg2lxYWHpkvuCaSQYkapc_LlxNgdm303JCq_TasKX3CmY2jSuN3NoiW-huyZXFBpTXCfP6gDmmYDGH_UeAHG3Huy_B8zRrN5pSUedJv-XZf2YqpLxaqGMeKY8MqJv4FewQMZRoBJWWWPA", false, true, null, "فلسفة الحرفة في العصر الرقمي: استعادة المعنى", null },
                    { 2, null, null, "د. يوسف المنصور", 5, "رحلة عبر المخطوطات والوثائق التاريخية لفهم كيف تم تدوين تاريخ الأندلس. الأندلس كانت حضارة متقدمة وغنية بالثقافات المتعددة، لكن كيف تم تدوين تاريخها؟ هل كانت الروايات التاريخية موثوقة أم أن كل مؤرخ أضاف لمسته الخاصة؟\r\n\r\nالمخطوطات الأندلسية تخبرنا الكثير عن الحياة في تلك الفترة. ابن حزم، الطبري، المقري وغيرهم من المؤرخين الأندلسيين تركوا لنا سجلات مفصلة عن الأحداث والحياة اليومية. لكن هذه الروايات تختلف أحياناً، مما يثير أسئلة حول الحقيقة والتفسير.\r\n\r\nالتاريخ ليس حقيقة مطلقة، بل هو تفسير من قبل شهود أو مؤرخين. كل راوٍ يختار التفاصيل التي يراها مهمة، ويترك جانباً ما يعتبره ثانوياً. هذا يعني أن تاريخ الأندلس الذي نعرفه اليوم هو انعكاس لاختيارات المؤرخين الأندلسيين وليس الحقيقة المطلقة.\r\n\r\nالخيال أيضاً لعب دوراً في تدوين التاريخ. الشعر والأدب كانا طرقاً للتعبير عن الأحداث التاريخية. القصائد والقصص الأدبية ساهمت في نقل الروح الحقيقية للعصر، حتى لو لم تكن دقيقة من الناحية الحرفية.\r\n\r\nعندما نقرأ تاريخ الأندلس اليوم، نحن نقرأ خليطاً من الحقيقة والخيال، من السجلات الموثوقة والرويات الملونة. هذا المزيج هو الذي يعطي لتاريخ الأندلس عمقه وجماله. نحن لا نتعرف على حقائق جافة، بل على قصة حية وممتعة.\r\n\r\nفهم هذا الفرق مهم لمن يدرس التاريخ. يجب أن نقرأ المصادر الأصلية بعين ناقدة، وأن نحاول فهم سياق كل رواية. يجب أن نقدر الجهد الذي بذله المؤرخون القدماء في حفظ ذاكرة حضارتهم.\r\n\r\nالأندلس تبقى واحدة من أعظم الحضارات في التاريخ، وتدوينها ظل أحد أعظم الإنجازات في تاريخ الكتابة التاريخية. مزجها بين الدقة والجمال، بين الحقيقة والخيال، أعطاها نسيجاً فريداً من نوعه.", new DateTime(2024, 5, 12, 0, 0, 0, 0, DateTimeKind.Utc), "https://lh3.googleusercontent.com/aida-public/AB6AXuDvTOcb-4WoMNK3FNHOWAcTbvAFvAD0hiv1psKJfVJwybTcPE53lT5uI4ykosZhyRTIspUWKuhLGxv5Z9Cs6mps1oc44soP13Ya5kISixiw8_iuWR74l-ZiTu5vTztHb4eiQEIlO7ub5EY4AdtEcsFQwSEnwkEjld2rTDx1QuKRBZpqRUoyNc3ziDBSh9759mJ_3sF0LQYe0tiPbQp9XIs4czw-w-bS0Wir1NOEfQZ4J__rQnpI-WbTNij60X-9ZG3tM53Krumer9Sk", false, true, null, "بين الحقيقة والخيال: تدوين التاريخ في الأندلس", null },
                    { 3, null, null, "أ. ليلى حسن", 13, "استكشاف تاريخ المجالس الأدبية في العواصم العربية ودورها في إثراء الثقافة. المجالس الأدبية كانت مراكز إشعاع ثقافي في عواصمنا العربية. في هذه المجالس، كان يجتمع الأدباء والشعراء والفلاسفة لمناقشة الأفكار وتبادل الآراء.\r\n\r\nمجالس بغداد في العصر العباسي كانت أسطورية. هنا التقى الكندي والفارابي والجاحظ وغيرهم من الفلاسفة والكتاب العظماء. كانوا يناقشون الفلسفة واللغة والأدب والعلوم. هذه المجالس أنتجت أعظم الأعمال الفكرية للحضارة الإسلامية.\r\n\r\nفي دمشق والقاهرة وقرطبة، كانت هناك مجالس أدبية متشابهة. في الأندلس، كانت مجالس الأمراء والعلماء مراكز للحوار الثقافي. المعتمد بن عباد، على سبيل المثال، كان يجمع حوله الشعراء والعلماء في مجالسه الشهيرة.\r\n\r\nهذه المجالس لم تكن مجرد اجتماعات اجتماعية. كانت مراكس للبحث والتطور الفكري. هنا ولدت الأفكار الجديدة، وتم نقد الأفكار القديمة. هنا تم تشكيل الذوق الأدبي والفكري لأجيال.\r\n\r\nالحوار في هذه المجالس كان حراً وتفاعلياً. كان الاختلاف في الرأي مقبولاً بل مرحباً به. هذه الحرية الفكرية أدت إلى إثراء الثقافة والأدب. من هنا خرجت أعظم الروائع الأدبية والفكرية.\r\n\r\nاليوم، مجالس الأدب أصبحت أقل شيوعاً. الإنترنت والوسائط الرقمية غيرت طريقة حوارنا. لكن هناك محاولات لاستعادة روح المجالس الأدبية التقليدية. في دول عربية مختلفة، هناك مجالس أدبية تحاول أن تحافظ على التقليد القديم.\r\n\r\nذاكرة هذه المجالس ما زالت حية في تراثنا الأدبي. الحوارات التي دارت فيها، الأفكار التي ولدت فيها، كل هذا بقي محفوظاً في المخطوطات والمؤلفات. قراءة هذه المخطوطات تعيدنا إلى عالم مختلف من الحوار الثقافي الغني.", new DateTime(2024, 5, 8, 0, 0, 0, 0, DateTimeKind.Utc), "https://lh3.googleusercontent.com/aida-public/AB6AXuDnKRzkjPE9Aa-O8S8G4O93mMJ6EWDq7GGhlK16BDgkglA9Jf9ohWLiD27FiI15QakRI2kKzxX-1kRd6M9_jTQ0wo1RtH6whXEMJuCkne87RfpMDeebo63iIL66vaZaxXY3o3oXw6K5nd--ZEyD3H95zaQXU_O1ib9l5Y7vJGbi5nv5k6zkdWETfluxuPBvhLIyZ-KJJsFLF17hfCt-VgBGqD9GWO6Lss3rfVdyLFbWdpahbR-ifnaa1WrzqXAHbsOuJeGlrWGShubr", false, true, null, "مجالس الأدب في العواصم العربية: ذاكرة الحوار", null },
                    { 4, null, null, "أ. سارة الراشد", 1, "نقاش معمّق حول تأثير تقنيات الذكاء الاصطناعي على الهوية الثقافية العربية. الذكاء الاصطناعي يغير طريقة تفكيرنا وعملنا وتعاملنا مع العالم. لكن ماذا عن تأثيره على هويتنا الثقافية؟\r\n\r\nالتكنولوجيا لطالما كانت أداة للتبديل الثقافي. الطباعة غيرت طريقة نشر المعرفة. الإذاعة والتلفاز غيرا طريقة استقبالنا للمعلومات والثقافة. الإنترنت فتح آفاقاً جديدة للتبادل الثقافي. والآن، الذكاء الاصطناعي يأتي بتأثيرات جديدة ومختلفة.\r\n\r\nمن جهة، الذكاء الاصطناعي يمكنه أن يساهم في الحفاظ على الثقافة العربية. يمكن استخدامه لحفظ النصوص القديمة، لترجمة الأعمال الأدبية، لتطوير محررات نصية تدعم اللغة العربية بشكل أفضل. التطبيقات التعليمية القائمة على الذكاء الاصطناعي يمكنها أن تعلم الأجيال الجديدة عن تراثنا.\r\n\r\nلكن من جهة أخرى، هناك تهديدات حقيقية. الخوارزميات التي تدفع بنا نحو محتوى معين قد تحد من تنوعنا الثقافي. إذا كانت معظم الذكاء الاصطناعي مبني على البيانات الغربية، فقد ينعكس هذا في المحتوى الذي يتم توليده. الثقافة العربية قد تصبح هامشية في عالم يحكمه الذكاء الاصطناعي.\r\n\r\nهناك أيضاً مسألة الملكية الثقافية. عندما يتم استخدام الأعمال الأدبية العربية القديمة لتدريب نماذج الذكاء الاصطناعي، من يستفيد من هذا؟ هل حقوق المؤلفين والثقافة محمية؟\r\n\r\nالحقيقة أن الذكاء الاصطناعي بحد ذاته لا يهدد ولا ينقذ الهوية الثقافية. كل يتعلق بكيفية استخدامنا له. إذا استخدمناه بحكمة، يمكن أن يكون أداة قوية لنشر وحفظ ثقافتنا. لكن إذا تركنا له الحبل على الغارب، قد نجد أنفسنا نسير بدون اتجاه.\r\n\r\nنحتاج إلى مناقشات جادة حول كيفية استخدام الذكاء الاصطناعي بطريقة تحافظ على هويتنا الثقافية. نحتاج إلى تطوير نماذج ذكاء اصطناعي عربية مبنية على قيمنا وثقافتنا. نحتاج إلى الحفاظ على السيطرة على أدواتنا، بدلاً من السماح لها بالسيطرة علينا.", new DateTime(2024, 5, 5, 0, 0, 0, 0, DateTimeKind.Utc), "https://lh3.googleusercontent.com/aida-public/AB6AXuBhLMRuyipwroCSKOsyhP0lA5dVBI4Dq9GPVGay4QTwlSpTCSq8_KbmReL0b0k-lskINCCJ_WVXMTkIwA-wwZDQDyMyx03lX4M3m2awmNqOiiIjIT0eaceEIeInzxSq5QCJsIdldPJyqyJX-yL4Ug82heunZRrc7oIEorvN6ChFbjUcCKtpggpNAYgZFQe51T_nDYWKYwzbxRW7cYyTAymM6YRuwu5eQXmDNVKgt4TfA_JX0VnbKm94gn1eg_EqWRI3fLnH6cbz_nMu", false, true, null, "الذكاء الاصطناعي: هل يهدد الهوية الثقافية؟", null },
                    { 5, null, null, "د. عمر القاسم", 13, "نظرة عميقة في الجذور الفكرية وكيف ساهمت في تشكيل الوعي المعاصر، مستكشفين الفراغ والضوء كعناصر روحية قبل أن تكون مادية. العمارة الإسلامية ليست مجرد عن بناء المساجد والقصور، بل هي تعبير عن رؤية كاملة للعالم.\r\n\r\nالفراغ في العمارة الإسلامية لم يكن فراغاً فارغاً. كان فراغاً مقصوداً، معبراً عن اللانهاية والخلود. الصحن الكبير في المسجد، المساحات المفتوحة بين الأعمدة، كل هذا كان جزءاً من فلسفة معينة. كانت العمارة الإسلامية تعلمنا أن الفراغ يمكن أن يكون له معنى، وأن الصمت يمكن أن يكون له صوت.\r\n\r\nالضوء أيضاً كان عنصراً روحياً في العمارة الإسلامية. الضوء الذي يخترق النوافذ الصغيرة والكبيرة، الظل الذي ينشأ من الأقواس والقباب، كل هذا كان جزءاً من تجربة روحية. المعمار الإسلامي كان يفهم أن الضوء والظل يمكنهما أن يؤثرا على الروح والعقل.\r\n\r\nالزخرفة الهندسية في العمارة الإسلامية لم تكن مجرد زينة. كانت محاولة لتمثيل الانسجام والنظام الكوني. الأنماط المتكررة، الأشكال الهندسية المعقدة، كل هذا كان انعكاساً لفهم عميق للرياضيات والفلسفة.\r\n\r\nالمسجد الإسلامي كان مساحة للتأمل والروحانية. ليس فقط بسبب الدين، بل أيضاً بسبب الطريقة التي تم تصميمها. المعماري الإسلامي كان يريد أن ينقل الإنسان من عالم الدنيا المادي إلى عالم روحاني أعلى. كل عنصر معماري كان جزءاً من هذه الرحلة.\r\n\r\nاليوم، يمكننا أن نتعلم الكثير من هذه الفلسفة المعمارية. في عالم يصرخ من الضوضاء والفوضى، يمكننا أن نجد السلام والهدوء في الفراغات المصممة بحكمة. في عالم يحتفي بالحشو والامتلاء، يمكننا أن نجد الجمال في البساطة والخطوط النظيفة.\r\n\r\nعمارة الروح الإسلامية تعلمنا أن العمارة ليست مجرد شكل وأسمنت، بل هي تجربة كاملة، تأثير على الروح والعقل والجسد. هذا الفهم العميق هو ما يميز العمارة الإسلامية ويجعلها خالدة.", new DateTime(2024, 5, 20, 0, 0, 0, 0, DateTimeKind.Utc), "https://lh3.googleusercontent.com/aida-public/AB6AXuAGaMizZifHeSWvvhp1FkJga8F5up4hBKUMUH-VMa1wk6VJ2-EjtLe984hkBoyUTPDlBJmFmIiKDDnTDZJy9g1H-AXNfVHaxnnK8DakMOoGV_ndmBUJAwEXYE-Y9d3mg2yNR1bi7EuJBKI640IIf4MhHyZYquCpEhMPOQUsnnb0pyypJUMi9JlX80vL1wBnbOCYQduWkgFmiZIJUjMDuOImss_626cy6ug3PVaMqGyqNQawEdvbcOSlhYASY0fjDsNGn014eWTQrqG5", false, true, null, "عمارة الروح: تأملات في الفلسفة المعمارية الإسلامية", null },
                    { 6, null, null, "د. أحمد السيد", 13, "استكشاف مفهوم الزمن في التراث الصوفي والتفسيرات المختلفة للزمن الروحي. الصوفيون القدماء لم ينظروا إلى الزمن كما نظرنا إليه نحن في العصر الحديث. الزمن لم يكن مجرد ساعات ودقائق، بل كان تجربة وحالة روحية.\r\n\r\nفي الفكر الصوفي، الزمن لديه أبعاد متعددة. هناك الزمن الخارجي، زمن الساعة والتاريخ. وهناك الزمن الداخلي، زمن الروح والقلب. الصوفي كان يسعى للتجاوز من الزمن الخارجي إلى الزمن الداخلي، من المادي إلى الروحي.\r\n\r\nالصوفيون تحدثوا عن حالات يختفي فيها الزمن تماماً. في لحظات من التأمل العميق أو الانجذاب الروحي، يشعر الصوفي أنه خارج الزمن. اللحظة تصبح أبدية، والأبدية تصبح حاضرة الآن.", new DateTime(2024, 5, 18, 0, 0, 0, 0, DateTimeKind.Utc), "https://via.placeholder.com/400x300?text=Sufi+Thought", false, true, null, "مفهوم الزمن في الفكر الصوفي القديم", null },
                    { 7, null, null, "د. سارة محمود", 13, "دراسة حول كيف تجلت الحداثة في الشعر العربي المعاصر وتأثيرها على الشعراء. الشعر العربي المعاصر شهد ثورة حقيقية عندما بدأ الشعراء يتحررون من القيود التقليدية. الشعر الحر والتفعيلة أتاحا للشعراء مساحات أكبر للتجريب والابتكار.\r\n\r\nنزار قباني، أدونيس، سميح القاسم وغيرهم من الشعراء المعاصرين احدثوا ثورة في الشعر العربي. جلبوا لغة جديدة، موضوعات جديدة، أساليب جديدة. الحداثة لم تكن مجرد شكل جديد، بل فلسفة جديدة لفهم الشعر والكتابة.\r\n\r\nالشعر المعاصر أصبح أكثر انفتاحاً على التجارب الشخصية والسياسية والاجتماعية. لا يعود الشاعر ملزماً بمواضيع معينة أو أشكال محددة. الحرية التي جلبتها الحداثة سمحت للشعراء أن يصرخوا من قلوبهم.", new DateTime(2024, 5, 16, 0, 0, 0, 0, DateTimeKind.Utc), "https://via.placeholder.com/400x300?text=Modern+Poetry", false, true, null, "تجليات الحداثة في الشعر العربي المعاصر", null },
                    { 8, null, null, "أ. محمد علي", 14, "دراسة حول كيف تؤثر البيئة العمرانية على الوعي والصحة النفسية للإنسان. المدينة ليست مجرد مجموعة من المباني والطرق. المدينة لها روح، وهذه الروح تؤثر على الناس الذين يعيشون فيها.\r\n\r\nالتصميم العمراني يؤثر على الحالة النفسية للإنسان. المدن الضيقة والمزدحمة تخلق ضغوطاً نفسية. المدن الواسعة والمفتوحة تجلب الاستقرار والسلام. الألوان، الأضواء، الأصوات، كل هذا يؤثر على وعينا بطرق قد لا ندركها.", new DateTime(2024, 5, 14, 0, 0, 0, 0, DateTimeKind.Utc), "https://via.placeholder.com/400x300?text=Urban+Psychology", false, true, null, "سيكولوجية المدن: كيف تؤثر البيئة على الوعي", null },
                    { 9, null, null, "د. فاطمة النعمان", 5, "تحليل شامل لتحديات ومستقبل اللغة العربية في عصر العولمة والتكنولوجيا. اللغة العربية تواجه تحديات حقيقية في العصر الحديث. الإنجليزية أصبحت لغة العلم والتكنولوجيا والعمل. الشباب يستخدمون لغة مختلطة، مزيج من العربية والإنجليزية والعامية.\r\n\r\nلكن اللغة العربية لم تمت. هناك محاولات جادة لتطويرها وجعلها تواكب العصر. المعاجم الإلكترونية، التطبيقات التعليمية، المحتوى الرقمي العربي، كل هذا يساهم في الحفاظ على اللغة وتطويرها.\r\n\r\nمستقبل اللغة العربية يعتمد على اهتمام الأجيال الجديدة بها. إذا استطعنا أن نجعل اللغة العربية جذابة وملائمة للعصر، يمكننا أن نضمن بقاؤها وازدهارها.", new DateTime(2024, 5, 11, 0, 0, 0, 0, DateTimeKind.Utc), "https://via.placeholder.com/400x300?text=Arabic+Language", false, true, null, "مستقبل اللغة العربية في ظل العولمة", null },
                    { 10, null, null, "د. محمود الأحمد", 13, "رحلة الكتابة الإبداعية من العصر الكلاسيكي إلى العصر الرقمي. الكتابة الإبداعية تطورت بشكل كبير مع تطور التكنولوجيا. من الورقة والحبر إلى الحاسوب والإنترنت، الكتابة أصبحت أكثر سهولة ولكن أيضاً أكثر تحدياً.\r\n\r\nالكاتب المعاصر يواجه فرصاً جديدة وتحديات جديدة. من جهة، يمكنه أن ينشر أعماله مباشرة للعالم. من جهة أخرى، يجب أن يتنافس مع ملايين الكتاب الآخرين. الجودة أصبحت أكثر أهمية من أي وقت مضى.\r\n\r\nالكتابة الإبداعية اليوم لا تقتصر على الرواية والقصة والشعر. هناك أشكال جديدة مثل الكتابة للإنترنت والتدوين والكتابة للعاب. كل هذه الأشكال تتطلب مهارات جديدة ومنهجيات جديدة.", new DateTime(2024, 5, 10, 0, 0, 0, 0, DateTimeKind.Utc), "https://via.placeholder.com/400x300?text=Creative+Writing", false, true, null, "الكتابة الإبداعية: من الورقة إلى الشاشة", null }
                });

            migrationBuilder.InsertData(
                table: "ArticleTags",
                columns: new[] { "ArticleId", "TagId" },
                values: new object[,]
                {
                    { 1, 13 },
                    { 1, 14 },
                    { 1, 15 },
                    { 2, 13 },
                    { 2, 14 },
                    { 2, 15 },
                    { 3, 8 },
                    { 3, 14 },
                    { 3, 15 },
                    { 4, 10 },
                    { 4, 13 },
                    { 4, 14 },
                    { 5, 13 },
                    { 5, 14 },
                    { 5, 15 },
                    { 6, 8 },
                    { 6, 14 },
                    { 6, 15 },
                    { 7, 13 },
                    { 7, 14 },
                    { 7, 15 },
                    { 8, 10 },
                    { 8, 13 },
                    { 8, 14 },
                    { 9, 8 },
                    { 9, 14 },
                    { 9, 15 },
                    { 10, 13 },
                    { 10, 14 },
                    { 10, 15 }
                });
        }
    }
}

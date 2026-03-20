next: 16.2.0

# Keyword học được
1. PPR (Partial Prerendering)
PPR = render một phần trang trước (static), phần còn lại render sau (dynamic)
[ Static UI ] + [ Dynamic data streaming sau ]
- SSR (render tất cả runtime)
- SSG (build trước toàn bộ)
- Cách dùng: dùng <Suspense />
2. dynamicIO
dynamicIO = cách Next.js detect và xử lý data động
3. Kysely - Một công cụ xây dựng truy vấn SQL kiểu an toàn và hỗ trợ tự động hoàn thành cho Typescript trên node.js.
- Tương tự Prisma nhưng Prisma là ORM - Object Relation Mapping, làm việc với DB qua model giống như object -> High-level, Abstraction nhiều, không có SQL control
- Còn Kysely viết SQL nhưng có TypeScript hỗ trợ -> Lowlevel, Abstraction ít, SQL control
4. 
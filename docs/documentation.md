# توثيق نظام القروض - بنك الاستثمار (Investment Bank)

هذا المستند يحتوي على المخططات الهندسية (UML) لنظام القروض عبر الإنترنت، كما هو مطلوب في مشروع هندسة البرمجيات.

## 1. مخطط حالات الاستخدام (Use Case Diagram)
يوضح التفاعل بين العميل (Customer) والنظام.

```mermaid
useCaseDiagram
    actor "عميل البنك" as Customer
    actor "موظف البنك" as Employee

    package "نظام القروض" {
        usecase "إنشاء حساب" as UC1
        usecase "تسجيل الدخول" as UC2
        usecase "استعراض أنواع القروض" as UC3
        usecase "تقديم طلب قرض" as UC4
        usecase "متابعة حالة الطلب" as UC5
        usecase "مراجعة الطلبات" as UC6
    }

    Customer --> UC1
    Customer --> UC2
    Customer --> UC3
    Customer --> UC4
    Customer --> UC5
    Employee --> UC6
    Employee --> UC2
```

## 2. مخطط الأصناف (Class Diagram)
يوضح هيكل البيانات والعلاقات بين الكيانات.

```mermaid
classDiagram
    class User {
        +String userId
        +String fullName
        +String nationalId
        +String email
        +String password
        +register()
        +login()
    }

    class Loan {
        +String loanId
        +String type
        +double profitRate
        +int durationMonths
        +double maxAmount
    }

    class LoanApplication {
        +String applicationId
        +String userId
        +String loanId
        +double requestedAmount
        +String status
        +Date submitDate
        +apply()
        +trackStatus()
    }

    User "1" -- "0..*" LoanApplication : يقدم
    Loan "1" -- "0..*" LoanApplication : مرتبط بـ
```

## 3. مخطط التتابع (Sequence Diagram)
يوضح عملية تقديم طلب القرض.

```mermaid
sequenceDiagram
    participant C as العميل
    participant S as النظام
    participant DB as قاعدة البيانات

    C->>S: تسجيل الدخول
    S->>DB: التحقق من البيانات
    DB-->>S: ناجح
    S-->>C: لوحة التحكم

    C->>S: اختيار نوع القرض (شخصي/سكني)
    S-->>C: نموذج طلب القرض

    C->>S: إرسال الطلب (المبلغ، المدة)
    S->>DB: حفظ طلب القرض
    DB-->>S: تم الحفظ بنجاح
    S-->>C: تأكيد استلام الطلب
```

## 4. مخطط المكونات (Component Diagram)
يوضح معمارية النظام البرمجية.

```mermaid
componentDiagram
    [واجهة المستخدم (React)] as UI
    [محرك القواعد (Business Logic)] as Engine
    [نظام المصادقة (Auth Service)] as Auth
    [قاعدة البيانات (Supabase/PostgreSQL)] as DB

    UI ..> Auth : استخدام
    UI ..> Engine : طلبات
    Engine ..> DB : تخزين/استرجاع
    Auth ..> DB : التحقق من الهوية
```

import React from 'react';
import Headers from '../components/Headers';
import Footer from '../components/Footer';

const AboutUs = () => {
  return (
    <div className="about-us-container bg-gray-50">
      {/* Header */}
      <Headers />

      {/* About Us Content */}
      <div className="container mx-auto py-16 px-5 lg:px-20">
        <h1 className="text-5xl font-extrabold text-center text-gray-800 mb-12">
          Về Chúng Tôi
        </h1>

        <p className="text-lg text-gray-600 mb-8 text-center">
          <strong className="text-2xl text-gray-900">Chào mừng bạn đến với ChicCycle!</strong>
        </p>

        <p className="text-lg text-gray-700 mb-6 leading-relaxed">
          Tại ChicCycle, chúng tôi tin rằng thời trang xứng đáng có một cuộc sống thứ hai. Nền tảng của chúng tôi là một chợ trực tuyến chuyên mua và bán quần áo đã qua sử dụng, giúp mọi người tiếp cận thời trang bền vững. Chúng tôi mong muốn giảm thiểu rác thải thời trang bằng cách khuyến khích mọi người tái chế tủ quần áo của họ, đồng thời cung cấp các lựa chọn quần áo giá cả phải chăng cho người mua.
        </p>

        <h2 className="text-3xl font-semibold mb-6 text-gray-900">Sứ Mệnh Của Chúng Tôi</h2>
        <p className="text-lg text-gray-700 mb-8 leading-relaxed">
          Sứ mệnh của chúng tôi rất đơn giản: làm cho thời trang trở nên bền vững hơn, dễ tiếp cận hơn và bao trùm hơn. Chúng tôi muốn tạo ra một cộng đồng nơi mọi người có thể thay đổi phong cách của mình mà không ảnh hưởng đến đạo đức. Bằng cách chọn mua đồ đã qua sử dụng, bạn không chỉ tiết kiệm tiền mà còn góp phần giảm thiểu tác động của thời trang nhanh đến môi trường.
        </p>

        <h2 className="text-3xl font-semibold mb-6 text-gray-900">Tại Sao Chọn ChicCycle?</h2>
        <ul className="list-disc ml-10 text-lg text-gray-700 mb-8 leading-relaxed">
          <li className="mb-4"><strong className="text-gray-900">Ưu Tiên Sự Bền Vững:</strong> Mỗi lần mua hàng tại ChicCycle, bạn đều góp phần giảm thiểu rác thải từ quần áo bỏ đi. Chúng tôi tin tưởng vào nền kinh tế tuần hoàn — nơi các món đồ được tái sử dụng thay vì bị vứt bỏ.</li>
          <li className="mb-4"><strong className="text-gray-900">Người Bán Được Xác Minh:</strong> Chúng tôi ưu tiên sự an toàn và minh bạch. Nền tảng của chúng tôi sử dụng công nghệ nhận diện khuôn mặt để xác minh danh tính của người bán, mang lại trải nghiệm mua sắm an toàn cho tất cả người dùng.</li>
          <li className="mb-4"><strong className="text-gray-900">Những Món Đồ Độc Đáo:</strong> Khám phá những món đồ hiếm có từ tủ quần áo trên khắp đất nước. Dù bạn đang tìm kiếm các món đồ cổ điển, những món đồ cơ bản chất lượng cao hay các món đồ thời trang nổi bật, ChicCycle luôn có sẵn mọi thứ cho bạn.</li>
          <li><strong className="text-gray-900">Định Hướng Cộng Đồng:</strong> Chúng tôi không chỉ là một chợ trực tuyến mà còn là một cộng đồng yêu thời trang, người tiêu dùng có ý thức và những người coi trọng chất lượng hơn số lượng. Hãy cùng chúng tôi tạo ra tác động tích cực đến môi trường và ngành thời trang!</li>
        </ul>

        <h2 className="text-3xl font-semibold mb-6 text-gray-900">Cách Hoạt Động</h2>
        <ol className="list-decimal ml-10 text-lg text-gray-700 mb-8 leading-relaxed">
          <li className="mb-4"><strong className="text-gray-900">Khám Phá & Mua Sắm:</strong> Tìm kiếm các món đồ yêu thích của bạn và thêm chúng vào giỏ hàng. Bạn sẽ tìm thấy nhiều phong cách quần áo với giá cả phải chăng.</li>
          <li className="mb-4"><strong className="text-gray-900">Bán Tủ Đồ Của Bạn:</strong> Có quần áo bạn không còn mặc nữa? Đăng bán chúng trên ChicCycle và kiếm thêm tiền trong khi giúp người khác tìm được bộ trang phục yêu thích mới của họ.</li>
          <li><strong className="text-gray-900">Giao Dịch An Toàn:</strong> Chúng tôi sử dụng các phương thức thanh toán được xác minh và cung cấp các tùy chọn thanh toán an toàn để cả người mua và người bán có thể mua và bán một cách an toàn.</li>
        </ol>

        <h2 className="text-3xl font-semibold mb-6 text-gray-900">Tham Gia Phong Trào</h2>
        <p className="text-lg text-gray-700 leading-relaxed">
          Tại ChicCycle, chúng tôi tin vào sức mạnh của những hành động nhỏ. Mỗi món đồ quần áo được bán lại là một bước tiến đến một tương lai bền vững hơn. Hãy tham gia cùng chúng tôi trong việc tái định nghĩa thời trang — từng món đồ một. Cùng nhau, chúng ta có thể tạo ra sự khác biệt cho hành tinh, ngành thời trang và cộng đồng của chúng ta.
        </p>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default AboutUs;

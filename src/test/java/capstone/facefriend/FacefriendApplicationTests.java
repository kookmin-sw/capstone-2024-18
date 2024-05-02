package capstone.facefriend;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.ArrayList;
import java.util.List;

@SpringBootTest
class FacefriendApplicationTests {

	@Test
	void contextLoads() {
		List<Integer> int1 = new ArrayList<>();
		int1.add(1);
		int1.add(2);

		List<Integer> int2 = new ArrayList<>();
		int2.add(3);
		int2.add(4);
		int2.add(5);

		int1.addAll(int2);

		System.out.println(int2);

	}

}

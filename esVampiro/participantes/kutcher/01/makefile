CC= gcc -O2
CFLAGS= -std=c99 -lm
test01: ../../../tester/test01.o kutcher01.o
	$(CC) -o $@ test01.c $+ $(CFLAGS)

../../../tester/test01.o: ../../../tester/test01.c
	$(CC) -c $< $(CFLAGS)
	mv test01.o ../../../tester/

kutcher01.o: kutcher01.c
	$(CC) -c $< $(CFLAGS)

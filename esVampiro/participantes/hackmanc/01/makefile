CC= gcc -O2
CFLAGS= -std=c99 -lm
test01: ../../../tester/test01.o hackmanc01.o
	$(CC) -o $@ test01.c $+ $(CFLAGS)

../../../tester/test01.o: ../../../tester/test01.c
	$(CC) -c $< $(CFLAGS)
	mv test01.o ../../../tester/

hackmanc01.o: hackmanc01.c
	$(CC) -c $< $(CFLAGS)
